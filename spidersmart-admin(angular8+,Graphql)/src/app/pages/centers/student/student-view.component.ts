import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact, Student, GraphQLResponse, ContactType, StudentService, Permission, ConfirmDialogComponent, Center, AssignmentSubmission, Enrollment, AssignmentStatus } from '@spidersmart/ng';
import { PageService, PageActions, AppContextService } from '@spidersmart/core';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'sm-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  /** 
   * The current student 
   */
  public student: Student;

  /**
   * Reference to the currently selected center
   */
  public center: Center;


  /** 
   * Reference to the ContactType enum 
   */
  public ContactType = ContactType;
  
  /** 
   * Subject to ensure all subscriptions close when element is destroyed 
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private studentService: StudentService,
    private activatedRoute: ActivatedRoute,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setLoading(true);

    // if the current student doesn't have an enrollment in the current center, redirect to the student list
    this.appContextService.getCenter().pipe(takeUntil(this.ngUnsubscribe)).subscribe((center: Center) => {
      // if the student does not have a center that matches the current context, redirect
      if (this.student && center) {
        const matches = (this.student.hasOwnProperty('enrollments')) ? this.student.enrollments.filter(enrollment => enrollment.hasOwnProperty('center') && enrollment.center.id === center.id).length > 0 : false;
        if (!matches) {
          this.router.navigate(['/', 'student']);
        }
      }
    });

    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.studentService.get(this.activatedRoute.snapshot.params.id).subscribe((response: GraphQLResponse<Student>) => {
        this.student = response.data;
        console.log('STUDENT', this.student);

        this.pageService.setTitle(this.student.firstName + ' ' + this.student.lastName);
        this.pageService.setLoading(false);
      });

      if (this.appContextService.hasPermission(Permission.STUDENT_IMPERSONATE)) {
        this.pageService.addFunctionAction(PageActions.impersonate, this.impersonate, [this.activatedRoute.snapshot.params.id]);
      }
      if (this.appContextService.hasPermission(Permission.ASSIGNMENT_REVIEW)) {
        this.pageService.addRoutingAction(PageActions.assignment, ['/student', this.activatedRoute.snapshot.params.id, 'assignment-submission']);
      }
      if (this.appContextService.hasPermission(Permission.STUDENT_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.bookInventory, ['/student', this.activatedRoute.snapshot.params.id, 'book-checkout']);
      }
      if (this.appContextService.hasPermission(Permission.STUDENT_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/student', this.activatedRoute.snapshot.params.id, 'edit']);
      }
      if (this.appContextService.hasPermission(Permission.STUDENT_DELETE)) {
        this.pageService.addFunctionAction(PageActions.delete, this.delete, [this.activatedRoute.snapshot.params.id]);
      }
    }
  }

  /**
   * Impersonates the student
   * @param id The id of the student to impersonate
   */
  public impersonate = (id: number): void => {
    this.pageService.setLoading(true);
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': this.cookieService.get('auth')
      })
    }
    this.http.post(this.appContextService.getEnvironmentVariable('authUrl') + '/impersonate', {id: this.student.id}, httpOptions).pipe(
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
   * Deletes the student
   */
  public delete = (id: number) => {
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

  /**
   * Get the assignment submissions for the student
   */
  public get assignmentSubmissions(): AssignmentSubmission[] {
    const assignments = [];
    if (this.student && this.student.hasOwnProperty('enrollments')) {
      this.student.enrollments.forEach((enrollment: Enrollment) => {
        if (enrollment.hasOwnProperty('assignments')) {
          assignments.push(...enrollment.assignments.filter((assignment: AssignmentSubmission) => {
            return [AssignmentStatus.revised, AssignmentStatus.submitted].includes(AssignmentStatus[assignment.status]);
          }));
        }
      });
      assignments.sort((a, b) => (a.dateFrom > b.dateFrom ? -1 : a.dateFrom < b.dateFrom ? 1 : 0));
    }
    return assignments;
  }

  /**
   * Generates an appropriate link for the given contact type
   * @param contact The contact for which a link should be generated
   * @return The output link
   */
  public generateContactLink(contact: Contact): string {
    switch (contact.type) {
      case ContactType.HOME_PHONE:
      case ContactType.MOBILE_PHONE:
      case ContactType.WORK_PHONE:
        return 'tel:' + contact.value;
      case ContactType.EMAIL:
        return 'mailto:' + contact.value;
      default:
        return contact.value;
    }
  }
}
