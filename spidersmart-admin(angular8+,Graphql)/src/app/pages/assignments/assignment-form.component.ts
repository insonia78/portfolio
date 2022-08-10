import { Component, OnInit, ApplicationRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { take, finalize, catchError, } from 'rxjs/operators';
import { merge, cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';

import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

import {
    GraphQLResponse,
    Assignment,
    Question,
    QuestionAnswer,
    AssignmentSection,
    Level,
    Subject,
    LevelService,
    AssignmentService,
    ApiValidator,
    ConfirmDialogComponent,
    BookSelectorDialogComponent,
    FileUploadDialogComponent,
    UploadedFile,
    Book,
    Enrollment
} from '@spidersmart/ng';
import { PageMode, PageService, AppContextService } from '@spidersmart/core';
import { AssignmentTemplates } from './assignment-templates';


/**
 * Specify types for available for fab menu buttons
 */
enum FabMenuButtonActions {
    ADD_QUESTION,
    ADD_SECTION
}

@Component({
    selector: 'sm-assignment-form',
    templateUrl: './assignment-form.component.html',
    styleUrls: ['./assignment-form.component.scss']
})
export class AssignmentFormComponent implements OnInit {
    /**
     * Stores loaded assignment data
     */
    public assignment: Assignment = {
        id: null,
        book: null,
        files: [],
        title: '',
        description: '',
        level: null,
        active: true,
        dateFrom: null,
        questions: [],
        sections: []
    };

    /**
     * Placeholder for available levels
     */
    public availableLevels: { [key: string]: Level[] } = {};

    /**
     * Height of quill editors
     */
    public readonly quillHeight = '100px';

    /**
     * Configuration for quill editor
     */
    public quillConfiguration = {
        formula: true,
        imageResize: {},
        toolbar: [['bold', 'italic', 'underline', 'strike', { 'script': 'sub' }, { 'script': 'super' }], ['blockquote', 'align', 'color'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'formula', 'image', 'code-block']]
    };

    /**
     * Configuration for fab menu items
     */
    public fabMenuButtons: MatFabMenu[] = [
        {
            id: FabMenuButtonActions.ADD_QUESTION,
            icon: 'help_outline',
            tooltip: 'Add Question',
            tooltipPosition: 'left',
            color: 'accent'
        },
        {
            id: FabMenuButtonActions.ADD_SECTION,
            icon: 'layers',
            tooltip: 'Add Section',
            tooltipPosition: 'left',
            color: 'accent'
        }
    ];

    /**
     * Assignment form group
     */
    public form: FormGroup;

    /**
     * Stores the currently selected tab
     */
    public currentSection = 0;

    /**
     * The default route back to the previous page
     */
    public backRoute = ['/assignment'];

    /**
     * The placeholder image to show when an image is loading or has failed to load
     */
    get placeholderImage(): string {
      return this.appContextService.getEnvironmentVariable('placeholderImage');
    }

    /**
     * Accessor for sections
     */
    get sections() {
        return this.form.get('sections') as FormArray;
    }

    /**
     * Accessor for questions
     */
    get questions() {
        return this.sections.controls[this.currentSection].get('questions') as FormArray;
    }

    /**
     * A book which has been selected to replace the current book
     */
    private newBook: Book = null;

    /**
     * @ignore
     */
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private toastService: ToastrService,
        private pageService: PageService,
        private assignmentService: AssignmentService,
        private levelService: LevelService,
        private appContextService: AppContextService,
        private appRef: ApplicationRef
    ) {
        // define form structure
        this.form = this.fb.group({
            title: ['', null, ApiValidator],
            description: ['', null, ApiValidator],
            level: [null, null, ApiValidator],
            sections: this.fb.array([])
        });
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.pageService.setLoading(true);

        // get available subjects and levels
        this.levelService.getAll().pipe(take(1)).subscribe((response: GraphQLResponse<Level[]>) => {
            // sort levels into subject groups
            response.data.forEach((level: Level) => {
                if (level.hasOwnProperty('subject')) {
                    if (!this.availableLevels.hasOwnProperty(level.subject.name)) {
                        this.availableLevels[level.subject.name] = [];
                    }
                    this.availableLevels[level.subject.name].push(level);
                }
            });
        });

        this.pageService.setTitle('Create Assignment');
        this.pageService.setMode(PageMode.CREATE);

        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Assignment');
            this.backRoute = ['/assignment', this.activatedRoute.snapshot.params.id, 'view'];

            this.assignmentService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Assignment>) => {
                // update data object and form data to response data, then set form as initialized
                this.assignment = response.data;
                this.form.patchValue({
                    title: this.assignment.title,
                    level: this.assignment.level,
                    description: this.assignment.description,
                });

                // build each section
                this.assignment.sections.forEach((section: AssignmentSection) => {
                    const questions = this.convertQuestionsToFormArray(section.questions);

                    (this.form.get('sections') as FormArray).push(
                        this.fb.group({
                            title: section.title,
                            instructions: section.instructions,
                            questions: questions
                        })
                    );
                });

                this.pageService.setLoading(false);
            });
        } else {
            this.pageService.setLoading(false);
        }
    }

    /**
     * Saves the current form state
     * @return void
     */
    public save = (): void => {
        this.pageService.setLoading(true);
        const newData = cloneDeep(this.form.value);

        // if editing, attach the id to the assignment
        if (this.assignment.id) {
            newData.id = this.assignment.id;
        }

        // add any book data to assignment
        if (this.assignment.book) {
            newData.book = {
                id: this.assignment.book.id
            };
        }

        // add any file attachment data to assignment
        if (this.assignment.files) {
            newData.files = this.assignment.files;
        }

        // remove unneeded data points from questions
        newData.sections.forEach(section => {
            section.questions.forEach(question => {
                if (question.type === 'multiple_choice' && question.hasOwnProperty('correct')) {
                    question.answers[question.correct].correct = true;
                }
                delete question.correct;
            });
        });

        // clear existing errors so that response shows 
        this.pageService.clearErrors();
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.assignmentService.modify : this.assignmentService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The assignment was edited successfully!' : 'The assignment was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The assignment could not be edited.' : 'The assignment could not be created.';

        action(newData).pipe(
            take(1),
            catchError((err) => {
                Object.entries(this.form.controls).forEach(([name, control]) => control.updateValueAndValidity());
                this.toastService.error(errorResponse);
                throw errorResponse;
            }),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success(successResponse);
                this.form.markAsPristine();
                this.form.markAsUntouched();
                this.router.navigate(this.backRoute);
            }
        });
    }

    /**
     * Selects the book to associate with the assignment
     */
    public selectBook() {
        const addBookDialog = this.dialog.open(BookSelectorDialogComponent, {
          width: '500px',
          data: {
            mode: 'search',
            title: 'Select Book',
            description: 'Choose the book(s) you would like to add to the inventory:',
            level: this.assignment.level
          }
        });

        addBookDialog.afterClosed().subscribe((selections: { enrollment: Enrollment, books: Book[] }) => {
            if (selections && selections.books && selections.books.length > 0) {
                this.assignment.book = selections.books[0];
            }
        });
    }

    /**
     * Adds files to the assignment
     */
    public addFiles(): void {
        const addFileDialog = this.dialog.open(FileUploadDialogComponent, {
            width: '500px',
            data: {
              title: 'Add File(s)',
              description: 'Choose the file(s) you would like to attach to the assignment:',
              allowedTypes: ['pdf','jpg'],
              availableRoles: ['attachment', 'answer_key', 'assignment'],
              defaultRole: 'attachment'
            }
        });

        addFileDialog.afterClosed().subscribe((files: UploadedFile[]) => {
            if (files && files.length > 0) {
                this.assignment.files = this.assignment.files.concat(files);
            }
        });
    }

    /**
     * Removes a file from the selected file list
     * 
     * @param file The file which should be removed
     */
    public removeFile(file: UploadedFile): void {
        const fileIndex = this.assignment.files.findIndex(selection => {
            // previously existing files will have an id which is guaranteed to identify the correct file
            // so use that if available
            if (file.hasOwnProperty('id')) {
                return selection.id === file.id;
            }

            // if it's a file that is added and not yet saved, try to find the correct file to remove by name and size
            // since that's all we have to look up with
            return (file.hasOwnProperty('file') && selection.hasOwnProperty('file') && file.file.name === selection.file.name && file.file.size === selection.file.size);
        });

        if (fileIndex > -1) {
            this.assignment.files.splice(fileIndex, 1);
        }
    }

    /**
     * Adds a new section to the page
     */
    public addSection() {
        this.sections.push(this.fb.group({
            title: 'New Section',
            instructions: null,
            questions: this.fb.array([])
        }));
        this.currentSection = this.sections.length - 1;
    }

    /**
     * Adds a new question to the current section
     */
    public addQuestion() {
        this.questions.push(this.fb.group({
            type: 'short_answer',
            question: '',
            correct: [[]],
            answer: '',
            answers: this.fb.array([])
        }));
    }

    /**
     * Adds a new answer to the given question
     * @param question The index of the question for which an answer should be added
     */
    public addAnswer(question: number) {
        (this.questions.at(question).get('answers') as FormArray).push(this.fb.group({
            answer: '',
            correct: false
        }));
    }

    /**
     * Removes the section at the given section
     * @param index The index of the section to remove
     */
    public removeSection(index: number) {
        // show confirm if there are any questions
        if ((this.sections.at(index).get('questions') as FormArray).length > 0) {
            const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Delete Section',
                    question: 'Deleting this section will also delete all questions inside of it.  Are you sure you want to do this?'
                }
            });

            confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed === true) {
                    this.sections.removeAt(index);
                }
            });
        } else {
            this.sections.removeAt(index);
        }
    }

    /**
     * Removes a question at the given index (within the currently selected tab)
     * @param index The index of the question to remove
     */
    public removeQuestion(index: number) {
        this.questions.removeAt(index);
    }

    /**
     * Removes the answer field at the given index for the given question
     * @param question The question for which the answer should be removed
     * @param index The index of the answer to be removed
     */
    public removeAnswer(question: number, index: number) {
        console.log(this.questions.at(question).get('answers') as FormArray, index);
        (this.questions.at(question).get('answers') as FormArray).removeAt(index);
    }

    /**
     * Select an assignment template from which to build the assignment
     * @param template The template to use
     */
    public setTemplate(template: string = 'blank') {
        AssignmentTemplates[template].sections.forEach((section: AssignmentSection) => {
            const questions = this.convertQuestionsToFormArray(section.questions);

            (this.form.get('sections') as FormArray).push(
                this.fb.group({
                    title: section.title,
                    instructions: section.instructions,
                    questions: questions
                })
            );
        });
    }

    /**
     * Triggers action based on fab menu selection
     * @param action The returned action
     */
    public fabMenuAction(action: FabMenuButtonActions) {
        switch (action) {
            case FabMenuButtonActions.ADD_QUESTION:
                this.addQuestion();
                break;
            case FabMenuButtonActions.ADD_SECTION:
                this.addSection();
                break;
        }
    }

    /**
     * Sets the currently active section index
     * @param section The index to set
     */
    public setCurrentSection(section: number) {
        this.currentSection = section;
    }

    /**
     * Utility method to patch field answers back to themselves when tab selection changes - workaround for issue with quill inside mat-tab
     * @see https://github.com/KillerCodeMonkey/ngx-quill/issues/198#issuecomment-437527002
     * 
     * @param sectionIndex The index of the section for which field answers should be synced to themselves
     */
    public syncSectionFields(sectionIndex: number) {
      // get section from form value since this will represent the current version with user changes that is displayed on screen
      const section = this.form.value.sections[sectionIndex] || null;
      if (section) {
        // patch the same answer back into each question - this will force rendering of questions using quill to respect provided markup
        section.questions.forEach((question, i) => {            
            this.getFormQuestions(sectionIndex).at(i).patchValue({
                question: question.question,
                answers: question.answers || []
            });
        });
      }
    }

    /**
     * Converts the given list of questions into a form array
     * @param questions The list of questions to convert
     * @return The converted form array
     */
    private convertQuestionsToFormArray(questions: Question[]): FormArray {
        const questionFormArray = this.fb.array([]);
        questions.forEach((question: Question) => {
            const answers = this.fb.array([]);
            const correct = [];
            if (question.hasOwnProperty('answers') && question.answers) {
                question.answers.forEach((answer: QuestionAnswer, i) => {
                    answers.push(this.fb.group({
                        answer: answer.answer,
                        correct: answer.correct
                    }));
                    // NOTE: due to how mat-radio and mat-radio-group works, we need to store the correct choice for multiple choice at the question level
                    if (answer.correct && question.type === 'multiple_choice') {
                        correct.push(i);
                    }
                });
                // essay types only have a single answer, so if none exists, an empty placeholder needs to be inserted
                if (question.type === 'essay' && question.answers.length < 1) {
                    answers.push(this.fb.group({
                        answer: '',
                        correct: true
                    }));
                }
            }

            questionFormArray.push(this.fb.group({
                question: question.question,
                type: question.type,
                answer: question.answer,
                correct: correct,
                answers: answers
            }));
        });
        console.log('QUESTION FORM ARRAY:::', questionFormArray);
        return questionFormArray;
    }

    /**
     * Repositions the order of the given question
     * @param event The drop event details
     */
    public repositionQuestion(event: CdkDragDrop<string[]>) {
        const currentControl = this.questions.at(event.previousIndex);
        this.questions.removeAt(event.previousIndex);
        this.questions.insert(event.currentIndex, currentControl);
    }

    /**
     * Utility method to generate level name display given a level object
     * @param level The level to generate a display for
     * @return The generated level string
     */
    public getLevelName(level: Level): string {
        return level && level.name ? level.subject.name + ': ' + level.name : '';
    }

    /**
     * Get the list of questions in a given section
     * @param section The index of the section for which to return questions
     * @return The list of questions
     */
    public getFormQuestions(section: number): FormArray {
        return this.sections.controls[section].get('questions') as FormArray;
    }

    /**
     * Get the list of answers for a given question in the given section
     * @param section The index of the section for which to return question answers
     * @param question  The index of the question within the given section for which to return answers
     * @return The list of answers
     */
    public getQuestionAnswers(section: number, question: number): FormArray {
        return this.getFormQuestions(section).controls[question].get('answers') as FormArray;
    }
}
