import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, forkJoin, throwError } from 'rxjs';
import { take, catchError, finalize, map } from 'rxjs/operators';
import { Student, GraphQLResponse, AssignmentSubmissionService, AssignmentSubmission, Permission, Assignment, StudentService, Enrollment, DatatableDataRequest, AssignmentStatus, ConfirmDialogComponent, GraphQLQueryFilter, SelectAssignmentDialogComponent } from '@spidersmart/ng';
import { PageService, AppContextService, PageActions, AppContextCenter } from '@spidersmart/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

/**
 * Component to display list of all assignment submissions for a student
 */
@Component({
  selector: 'sm-student-submission-list',
  templateUrl: './student-submission-list.component.html'
})
export class StudentSubmissionListComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /**
   * The list of assignment statuses which require the users interaction
   */
  private readonly editableStatuses = [AssignmentStatus.submitted, AssignmentStatus.revised, AssignmentStatus.review_draft];

  /**
   * The list of statuses which denote that the student is drafting
   */
  private readonly studentDraftStatuses = [AssignmentStatus.draft, AssignmentStatus.revision_draft];

  /**
   * Reference to AssignmentStatus enum for template access
   */
  public AssignmentStatus = AssignmentStatus;

  /** 
   * Subject of current student data, we need this to trigger changes to the data source from this end 
   */
  public submissions: BehaviorSubject<GraphQLResponse<AssignmentSubmission[]>> = new BehaviorSubject<GraphQLResponse<AssignmentSubmission[]>>({
    loading: true,
    data: []
  });

  /**
   * Whether to show completed assignments or only those that are currently editable
   * @ignore
   */
  public showCompleted = false;

  /**
   * Whether to show assignments which are locked
   * @ignore
   */
  public showLocked = false;

  /** 
   * Reference to the current users accessible centers 
   */
  private accessibleCenters: AppContextCenter[] = [];

  /** 
   * Reference to student details 
   */
  private student: Student = null;

  /**
   * The current table settings of the submissions table
   */
  private currentTableSettings: DatatableDataRequest = {
    limit: 10,
    offset: 0,
    sort: 'status',
    order: 'asc',
    filter: ''
  };

  /** 
   * Subject to ensure all subscriptions close when element is destroyed 
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * The placeholder image to show when an image is loading or has failed to load
   */
  get placeholderImage(): string {
    return this.appContextService.getEnvironmentVariable('placeholderImage');
  }

  /**
   * @ignore
   */
  constructor(
    private submissionService: AssignmentSubmissionService,
    private studentService: StudentService,
    private appContextService: AppContextService,
    public pageService: PageService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.appContextService.getAccessibleCenters().pipe(take(1)).subscribe(centers => {
      this.accessibleCenters = centers;
    });
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.student = { id: this.activatedRoute.snapshot.params.id } as Student;
      this.studentService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((student: GraphQLResponse<Student>) => {
        this.student = student.data;
      });
      if (this.appContextService.hasPermission(Permission.ASSIGNMENT_ASSIGN)) {
        this.pageService.addFunctionAction(PageActions.create, this.addAssignment, [this.activatedRoute.snapshot.params.id]);
      }
    }
    this.pageService.setTitle('Assignment Submissions');
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Toggles whether current assignments list should include completed assignments
   */
  public toggleShowComplete() {
    this.showCompleted = !this.showCompleted;
    this.loadSubmissions(this.currentTableSettings);
  }

  /**
   * Toggles whether current assignments list should include locked assignments
   */
  public toggleShowLocked() {
    this.showLocked = !this.showLocked;
    this.loadSubmissions(this.currentTableSettings);
  }

  /**
   * Determines whether the submission is a student draft or not
   * @param submission The submission to verify
   */
  public isStudentDraft(submission: AssignmentSubmission): boolean {
    return (this.studentDraftStatuses.includes(AssignmentStatus[submission.status]) && submission.lastNonDraft !== null);
  }

  /**
   * Determines whether the submission is editable
   * @param submission The submission to verify
   */
  public isEditable(submission: AssignmentSubmission): boolean {
    return (this.editableStatuses.includes(AssignmentStatus[submission.status]));
  }

  /**
   * Completes the given assignment
   * @param id The id of the assignment to complete
   */
  public complete = (id: number): void => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Complete Assignment',
        question: 'This will complete the assignment and leave it unopen for revision.  Are you sure you want to do this?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.submissionService.complete({ id: id } as AssignmentSubmission).pipe(
          take(1),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe(response => {
          if (response.success) {
            this.loadSubmissions(this.currentTableSettings);
            this.toastService.success('The assignment was completed successfully!');
          }
          else {
            this.toastService.error('The assignment could not be completed.');
          }
        });
      }
    });
  }

  /**
   * Loads the submissions for the table
   */
  public loadSubmissions(event: DatatableDataRequest): void {
    this.submissions.next({
      loading: true,
      data: []
    });

    // update current display options from request
    this.currentTableSettings = event;

    // derive the filters to send based on user-defined selections
    const filters: GraphQLQueryFilter[] = [];
    if (this.showLocked && this.showCompleted) {
      filters.push({
        field: 'status',
        values: this.studentDraftStatuses,
        comparison: '!in'
      });
    } else if (this.showLocked) {
      filters.push({
        field: 'status',
        values: [...this.studentDraftStatuses, AssignmentStatus.complete],
        comparison: '!in'
      });
    } else if (this.showCompleted) {
      filters.push({
        field: 'status',
        values: [...this.editableStatuses, AssignmentStatus.complete],
        comparison: 'in'
      });
    } else {
      filters.push({
        field: 'status',
        values: this.editableStatuses,
        comparison: 'in'
      });
    }
    
    // update to getAll from center
    this.submissionService.getAllByStudent(this.student, {
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: event.sort,
        direction: event.order
      },
      filters: filters

    }).pipe(
      take(1),
      map((submissions: GraphQLResponse<AssignmentSubmission[]>) => {
        // flatten submission structure for table data
        submissions.data.forEach((submission: AssignmentSubmission) => {
          if (submission.assignment.book) {
            submission.bookCoverImage = this.placeholderImage;
            if (submission.bookCoverImage) {
              submission.bookCoverImage = this.appContextService.getEnvironmentVariable('uploadUrl') + submission.assignment.book.coverImage;
            }
          }
          submission.title = (submission.assignment.book !== null) ? submission.assignment.book.title : submission.assignment.title;
        });
        return submissions as GraphQLResponse<AssignmentSubmission[]>;
      })
    ).subscribe((submissions: GraphQLResponse<AssignmentSubmission[]>) => {
      this.submissions.next(submissions);
    });
  }

  /**
   * Add a new assignment or assignments
   */
  public addAssignment = () => {
    // limit the enrollments available to those acessible by the current user
    const availableEnrollments = this.student.enrollments.filter((enrollment: Enrollment) => {
      for (let i = 0; i < this.accessibleCenters.length; i++) {
        if (Number(this.accessibleCenters[i].id) === enrollment.center.id) {
          return true;
        }
      }
      return false;
    });

    // this will need to be restricted based on permissions - and later, based on the enrollments which align between the teacher/director
    const addAssignmentDialog = this.dialog.open(SelectAssignmentDialogComponent, {
      width: '500px',
      data: {
        title: 'Add Assignment',
        description: 'Choose the assignments(s) you would like to assign to this student:',
        student: this.student,
        availableEnrollments: availableEnrollments,
        filterMinLength: 3
      }
    });

    addAssignmentDialog.afterClosed().subscribe((selections: { enrollment: Enrollment, assignments: Assignment[] }) => {
      if (selections && selections.enrollment && selections.assignments && selections.assignments.length > 0) {
        this.pageService.setLoading(true);

        // build a list of request to make, one for each new assignment that is to be assigned
        const requests = [];
        selections.assignments.forEach(assignment => {
          requests.push(this.submissionService.create({
            enrollment: selections.enrollment,
            assignment: assignment
          } as AssignmentSubmission));
        });

        // send the requests
        forkJoin(requests).pipe(
          catchError((err) => {
            this.pageService.setLoading(false);
            this.toastService.error('The assignment(s) could not be assigned.');
            return throwError(err);
          }),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe((response: GraphQLResponse<AssignmentSubmission>[]) => {
          // update the submissions list with any successfully assigned assignments and keep track of how many errors exist
          let errors = 0;
          let submissions = this.submissions.getValue();          
          response.forEach((result: GraphQLResponse<AssignmentSubmission>) => {
            if (result.success) {
              submissions.data.push(result.data);
            } else {
              errors++;
            }
          })

          // show the correct response based on how many errors occurred and update the submissions list if necessary
          if (errors >= requests.length) {
            this.toastService.error('The assignment(s) could not be assigned.');
          } else {
            if (errors > 0) {
              this.toastService.warning(errors + ' of the ' + requests.length + ' assignment(s) failed to assign.');
            } else {
              this.toastService.success('The assignments(s) were assigned successfully!');
            }
            this.submissions.next(this.submissionService.createQueryResponse<AssignmentSubmission[]>(submissions.data));
          }
        });
      }
    });
  }
}
