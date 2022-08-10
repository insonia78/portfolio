import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, combineLatest, forkJoin, throwError } from 'rxjs';
import { take, takeUntil, finalize, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Student, StudentService, GraphQLResponse, ConfirmDialogComponent, Permission, Enrollment, Assignment, AssignmentSubmissionService, AssignmentSubmission, DatatableDataRequest, TeacherService, GraphQLQueryOptions, SelectAssignmentDialogComponent } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService, AppContextCenter } from '@spidersmart/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

/**
 * Component to display list of all students
 */
@Component({
  selector: 'sm-student-list',
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  
  /** 
   * Subject of current student data, we need this to trigger changes to the data source from this end
   */
  public students: Subject<GraphQLResponse<Student[]>> = new BehaviorSubject<GraphQLResponse<Student[]>>({
    loading: true,
    data: []
  });

  /**
   * Reference to the current user id
   */
  private userId: number = null;

  /** 
   * Reference to the current users accessible centers 
   */
  private accessibleCenters: AppContextCenter[] = [];

  /** 
   * Reference to the current selected center 
   */
  private currentCenter: AppContextCenter = null;  

  /**
   * The current table settings of the students table
   */
  private currentTableSettings: DatatableDataRequest = {
    limit: 10,
    offset: 0,
    sort: 'name',
    order: 'asc',
    filter: ''
  };
  
  /** 
   * Subject to ensure all subscriptions close when element is destroyed 
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * @ignore
   */
  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private submissionService: AssignmentSubmissionService,
    private pageService: PageService,
    private appContextService: AppContextService,
    private dialog: MatDialog,
    private toastService: ToastrService,
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Manage Students');
    if (this.appContextService.hasPermission(Permission.STUDENT_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/student', 'create']);
    }

    // set data source to reload (and potentially change) based on changes in center context
    combineLatest([
      this.appContextService.getCenter(),
      this.appContextService.getAccessibleCenters(),
      this.appContextService.getUserId()
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(([center, accessibleCenters, userId]) => {
      this.accessibleCenters = accessibleCenters;
      this.currentCenter = center;
      this.userId = userId;
      this.loadData(this.currentTableSettings);
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
   * Loads student data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.students.next({
      loading: true,
      data: []
    });

    // update current display options from request
    this.currentTableSettings = event;

    // determine center constraint and update data
    const centers = (this.currentCenter !== null) ? this.currentCenter.id : this.accessibleCenters.map(ctr => Number(ctr.id));
    const constraints = {
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: (event.sort === 'lastName') ? 'name' : event.sort,
        direction: event.order
      },
      filters: [
        { field: 'name', value: event.filter, comparison: 'contains' }
      ]
    } as GraphQLQueryOptions;

    // determine service call based on permissions
    const service = (this.appContextService.hasPermission(Permission.STUDENT_VIEW)) ? this.studentService.getAllFromCenter(centers, constraints) : this.teacherService.getStudents(this.userId, constraints);
    service.pipe(take(1)).subscribe((students: GraphQLResponse<Student[]>) => {
      this.students.next(students);
    });
  }

  /**
   * Add a new assignment or assignments to the given student
   * @param student The student to which assignments should be assigned
   */
  public addAssignment = (student: Student): void => {
    // limit the enrollments available to those acessible by the current user
    const availableEnrollments = student.enrollments.filter((enrollment: Enrollment) => {
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
        student: student,
        filterMinLength: 3,
        availableEnrollments: availableEnrollments
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
          // keep track of how many errors exist and show the appropriate response
          let errors = 0;
          response.forEach((result: GraphQLResponse<AssignmentSubmission>) => {
            if (!result.success) {
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
          }
        });
      }
    });
  }

  /**
   * Impersonates the student
   * @param student The student to impersonate
   */
  public impersonate = (student: Student): void => {
    this.pageService.setLoading(true);
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': this.cookieService.get('auth')
      })
    }
    this.http.post(this.appContextService.getEnvironmentVariable('authUrl') + '/impersonate', {id: student.id}, httpOptions).pipe(
      take(1)
    ).subscribe((response: any) => {
      this.pageService.setLoading(false);
      if (response && response.hasOwnProperty('access_token')) {
        this.cookieService.set('auth', response.access_token, { domain: response.domain });
        if (response.hasOwnProperty('redirect')) {
          window.location.href = response.redirect;
        }
      }
    });
  }

  /**
   * Locks the given students' account
   * @param student The student or students who should be locked
   */
  public lock = (students: Student | Student[]): void => {
    students = (!Array.isArray(students)) ? [students] : students;
    this.pageService.setLoading(true);

    // build a list of request to make, one for each student that should be locked
    const requests = [];
    students.forEach(student => {
      requests.push(this.studentService.lock(student));
    });

    // send the requests
    forkJoin(requests).pipe(
      catchError((err) => {
        this.pageService.setLoading(false);
        this.toastService.error('The student(s) could not be locked.');
        return throwError(err);
      }),
      finalize(() => {
        this.pageService.setLoading(false);
      })
    ).subscribe((response: GraphQLResponse<Student>[]) => {
      // update the checkouts list with returned books
      let errors = 0;
      
      // show the correct response based on how many errors occurred and update the checkouts list if necessary
      if (errors >= requests.length) {
        this.toastService.error('The students(s) could not be locked.');
      } else {
        if (errors > 0) {
          this.toastService.warning(errors + ' of the ' + requests.length + ' student(s)\' accounts failed to lock.');
        } else {
          this.toastService.success('The student(s)\' accounts were locked successfully!');
        }
        this.loadData(this.currentTableSettings);
      }
    });
  }

  /**
   * Unlocks the given students' account
   * @param student The student or students who should be unlocked
   */
  public unlock = (students: Student | Student[]): void => {
    students = (!Array.isArray(students)) ? [students] : students;
    this.pageService.setLoading(true);

    // build a list of request to make, one for each student that should be locked
    const requests = [];
    students.forEach(student => {
      requests.push(this.studentService.unlock(student));
    });

    // send the requests
    forkJoin(requests).pipe(
      catchError((err) => {
        this.pageService.setLoading(false);
        this.toastService.error('The student(s) could not be unlocked.');
        return throwError(err);
      }),
      finalize(() => {
        this.pageService.setLoading(false);
      })
    ).subscribe((response: GraphQLResponse<Student>[]) => {
      // update the checkouts list with returned books
      let errors = 0;
      
      // show the correct response based on how many errors occurred and update the checkouts list if necessary
      if (errors >= requests.length) {
        this.toastService.error('The students(s) could not be unlocked.');
      } else {
        if (errors > 0) {
          this.toastService.warning(errors + ' of the ' + requests.length + ' student(s)\' accounts failed to unlock.');
        } else {
          this.toastService.success('The student(s)\' accounts were unlocked successfully!');
        }
        this.loadData(this.currentTableSettings);
      }
    });
  }

  /**
   * Deletes the students
   * @param id The id of the student to delete
   */
  public delete = (id: number): void => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Student',
        question: 'Are you sure you want to delete this student?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.studentService.delete(id).pipe(
          take(1),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe(response => {
          if (response.success) {
            this.toastService.success('The student was deleted successfully!');
          }
          else {
            this.toastService.error('The student could not be deleted.');
          }
        });
      }
    });
  }
}
