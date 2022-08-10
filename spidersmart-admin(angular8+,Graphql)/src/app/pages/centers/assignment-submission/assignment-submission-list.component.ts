import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { take, takeUntil, finalize, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  AssignmentSubmissionService,
  AssignmentSubmission,
  Center,
  GraphQLResponse,
  ConfirmDialogComponent,
  AssignmentStatus,
  Permission,
  GraphQLQueryFilter,
  DatatableDataRequest,
  GraphQLQueryOptions,
  Teacher
} from '@spidersmart/ng';
import { PageService, AppContextService } from '@spidersmart/core';

/**
 * Component to display list of all assignment submissions
 */
@Component({
  selector: 'sm-assignment-submission-list',
  templateUrl: './assignment-submission-list.component.html',
  styleUrls: ['./assignment-submission-list.component.scss']
})
export class AssignmentSubmissionListComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /**
   * The list of assignment statuses which require the users interaction
   */
  private readonly editableStatuses = ['submitted', 'revised', 'review_draft'];

  /**
   * The list of statuses which denote that the student is drafting
   */
  private readonly studentDraftStatuses = ['draft', 'revision_draft'];

  /**
   * Reference to AssignmentStatus enum for template access
   */
  public AssignmentStatus = AssignmentStatus;

  /**
   * Reference to the current user id
   */
  private userId: number = null;

  /** Subject of current student data, we need this to trigger changes to the data source from this end */
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
   * List of centers for which submissions are currently displaying 
   */
  private centers: Center[] = [];

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
    private pageService: PageService,
    private appContextService: AppContextService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Assignment Submissions');

    // set data source to reload (and potentially change) based on changes in center context
    combineLatest([
      this.appContextService.getCenter(),
      this.appContextService.getAccessibleCenters(),
      this.appContextService.getUserId()
    ]).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(([center, accessibleCenters, userId]) => {
      this.centers = ((center !== null) ? [center] : accessibleCenters) as Center[];
      this.userId = userId;
    });
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
    return (this.studentDraftStatuses.includes(submission.status) && submission.lastNonDraft !== null);
  }

  /**
   * Determines whether the submission is editable
   * @param submission The submission to verify
   */
  public isEditable(submission: AssignmentSubmission): boolean {
    return (this.editableStatuses.includes(submission.status));
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
        values: [...this.studentDraftStatuses, 'complete'],
        comparison: '!in'
      });
    } else if (this.showCompleted) {
      filters.push({
        field: 'status',
        values: [...this.editableStatuses, 'complete'],
        comparison: 'in'
      });
    } else {
      filters.push({
        field: 'status',
        values: this.editableStatuses,
        comparison: 'in'
      });
    }

    // if there are event filters
    if (event.filter) {
/*       filters.push({
        field: 'dateFrom,center',
        value: event.filter
      }); */
    }

    const constraints = {
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: event.sort,
        direction: event.order
      },
      filters: filters
    } as GraphQLQueryOptions;


    // determine service call based on permissions
    // this does make some assumptions about permission grouping that are specific to teachers
    const service = (this.appContextService.hasPermission(Permission.STUDENT_VIEW_ASSIGNED) && !this.appContextService.hasPermission(Permission.STUDENT_VIEW)) ? this.submissionService.getAllByTeacher({id: this.userId} as Teacher, constraints) : this.submissionService.getAllByCenters(this.centers, constraints);
    
    // update to getAll from center
    service.pipe(
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
}
