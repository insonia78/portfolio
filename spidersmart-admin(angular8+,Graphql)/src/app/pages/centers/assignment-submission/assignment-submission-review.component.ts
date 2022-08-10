import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, catchError, finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  AssignmentSubmission,
  AssignmentSubmissionService,
  StudentService,
  Question,
  GraphQLResponse,
  AssignmentStatus
} from '@spidersmart/ng';
import { PageService } from '@spidersmart/core';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment-submission-review.component.html',
  styleUrls: ['./assignment-submission-review.component.scss']
})
export class AssignmentSubmissionReviewComponent implements OnInit, OnDestroy {
  /**
   * List of the statuses which are readonly and cannot be edited
   */
  private readonly editableStatuses = [AssignmentStatus.submitted, AssignmentStatus.revised, AssignmentStatus.review_draft];

  /**
   * The list of statuses which denote that the student is drafting
   */
  private readonly studentDraftStatuses = [AssignmentStatus.draft, AssignmentStatus.revision_draft];

  /**
   * The amount of time after a change before an autosave is initiated
   */
  private readonly autosaveDebounceTime = 2000;

  /**
   * Reference to the current state of the submission
   */
  public submission: AssignmentSubmission = null;

  /**
   * The id of the currently selected question
   */
  public selectedQuestionId: number = null;

  /** Whether changes to the assignment will automatically save as draft */
  public autosave = true;

  /** Whether the submission should complete upon submit */
  public completeOnSubmit = false;

  /**
   * Assignment form group
   */
  public form: FormGroup;

  /**
   * Configuration for quill editor
   */
  public quillConfiguration = {
    // formula: true,
    // imageResize: {},
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', { script: 'sub' }, { script: 'super' }],
      ['blockquote', 'align', 'color'], [{ list: 'ordered' }, { list: 'bullet' }]]
    // , ['link', 'formula', 'image', 'code-block']]
  };

  public formInitialized = false;

  /** used to destroy any subscriptions when component is destroyed */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * Accessor to retrieve all sections in the form
   * @ignore
   */
  get formSections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  /**
   * Accessor to retrieve student draft status of the submission
   * @ignore
   */
  get isStudentDraft(): boolean {
    return (this.submission && this.studentDraftStatuses.includes(AssignmentStatus[this.submission.status]) && this.submission.lastNonDraft !== null);
  }

  /**
   * Accessor to retrieve editable status of the submission
   * @ignore
   */
  get isEditable(): boolean {
    return (this.submission && this.editableStatuses.includes(AssignmentStatus[this.submission.status]));
  }

  /**
   * @ignore
   */
  constructor(
    private fb: FormBuilder,
    private assignmentSubmissionService: AssignmentSubmissionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService,
    private studentService: StudentService
  ) {
    // define form structure
    this.form = this.fb.group({
      sections: this.fb.array([])
    });
  }

  /**
   * @ignore
   */
  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.assignmentSubmissionService.get(this.activatedRoute.snapshot.params.id).subscribe((response: GraphQLResponse<AssignmentSubmission>) => {
        this.submission = response.data;
        // add controls to the form for each question
        this.submission.assignment.sections.forEach((section, i, sections) => {
          const sectionQuestions = this.fb.array([]);

          section.questions.forEach((question, j) => {
            // get information about any answer or reviews existing for this question
            // note that if the current version is a student draft, the last non-draft version should populate instead
            let studentAnswer = null;
            if (this.isStudentDraft && this.submission.lastNonDraft.hasOwnProperty('answers') && this.submission.lastNonDraft.answers !== null) {
              studentAnswer = this.submission.lastNonDraft.answers.find(answer => answer.question.id === question.id) || null;
            } else if (this.submission.hasOwnProperty('answers') && this.submission.answers !== null) {
              studentAnswer = this.submission.answers.find(answer => answer.question.id === question.id) || null;
            }
            // add the question to the form
            sectionQuestions.push(this.fb.group({
              id: (studentAnswer !== null) ? studentAnswer.id : null,
              answer: (studentAnswer !== null) ? studentAnswer.answer : null,
              question: question,
              correct: (studentAnswer !== null) ? studentAnswer.correct : null,
              correction: (studentAnswer !== null) ? (studentAnswer.correction !== null ? studentAnswer.correction : studentAnswer.answer) : null,
              comments: (studentAnswer !== null) ? studentAnswer.comments : null
            }));
          });

          // add section to form
          this.formSections.push(this.fb.group({
            id: section.id,
            title: section.title,
            instructions: section.instructions,
            questions: sectionQuestions
          }));
        });
        this.formInitialized = true;
        this.form.valueChanges.pipe(
          debounceTime(this.autosaveDebounceTime),
          takeUntil(this.ngUnsubscribe)
        ).subscribe(formData => {
          if (this.autosave) {
            this.autoSave();
          }
        });
      });
    }
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Sets the currently selected question id
   * @param question The question which should be selected or deselected
   */
  public setSelectedQuestion(question: Question) {
    this.selectedQuestionId = (this.isEditable && question !== null) ? question.id : null;
  }

  /**
   * Clears the currently selected question id of a matching question
   * @param question The question to compare and remove if currently selected
   */
  public clearSelectedQuestion(question: Question) {
    if (this.selectedQuestionId === question.id) {
      this.selectedQuestionId = null;
    }
  }

  /**
   * Saves the current form data as a draft
   */
  public save = (): void => {
    if (!this.form.pristine && this.isEditable) {
      this.pageService.setLoading(true);
      const data = this.getSubmissionDataFromForm();
      this.assignmentSubmissionService.saveReviewDraft(data).pipe(
        take(1),
        catchError((err) => {
          Object.entries(this.form.controls).forEach(([name, control]) => {
            control.markAsUntouched();
            control.markAsPristine();
          });
          this.toastService.error('The review draft failed to save. Please be sure to save your work before leaving.');
          throw err;
        }),
        finalize(() => {
          this.pageService.setLoading(false);
        })
      ).subscribe(response => {
        if (response.success) {
          this.toastService.success('The review draft was saved!');
        }
      });
    } else {
      this.toastService.warning('No changes were made since the last save.');
    }
  }

  /**
   * Submits the current form data as a review
   */
  public submit = (): void => {
    if (this.isEditable) {
      // get the current autosave state so it can be reinstated in the case of an error and then turn off autosave to prevent an extra
      // draft from being saved
      const currentAutosaveState = this.autosave;
      this.autosave = false;

      this.pageService.setLoading(true);
      const data = this.getSubmissionDataFromForm();
      this.assignmentSubmissionService.submitReview(data, this.completeOnSubmit).pipe(
        take(1),
        catchError((err) => {
          Object.entries(this.form.controls).forEach(([name, control]) => control.updateValueAndValidity());
          this.toastService.error('The review could not be sent.');
          throw err;
        }),
        finalize(() => {
          this.autosave = currentAutosaveState;
          this.pageService.setLoading(false);
        })
      ).subscribe(response => {
        if (response.success) {
          this.toastService.success('The assignment review was sent!');
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.pageService.goBack();
        }
      });
    }
  }

  /**
   * Saves the current form data silently, only if data has changed
   */
  private autoSave() {
    if (!this.form.pristine && this.isEditable) {
      const data = this.getSubmissionDataFromForm();
      this.assignmentSubmissionService.saveReviewDraft(data).pipe(
        take(1),
        catchError((err) => {
          this.toastService.error('The review draft failed to autosave.  Please be sure to save your work before leaving.');
          throw err;
        })
      ).subscribe(response => {
        if (response.success) {
          this.toastService.success('The review draft was automatically saved!');
          this.form.markAsPristine();
        }
      });
    }
  }

  /**
   * Converts current form state into submission data object to send for persistence
   */
  private getSubmissionDataFromForm() {
    // combine question data from form into one object and update submission answer data with that
    const questions = [];
    this.form.value.sections.forEach(section => {
      section.questions.forEach(question => {
        questions.push(question);
      });
    });
    const data = Object.assign({}, this.submission, {
      answers: questions
    });
    return data;
  }
}
