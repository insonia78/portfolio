import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact, Teacher, GraphQLResponse, ContactType, TeacherService, Permission, ConfirmDialogComponent } from '@spidersmart/ng';
import { PageService, PageActions, AppContextService } from '@spidersmart/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'sm-teacher-view',
  templateUrl: './teacher-view.component.html',
  styleUrls: ['./teacher-view.component.scss']
})
export class TeacherViewComponent implements OnInit {
  /** The current teacher */
  public teacher: Teacher;
  /** Reference to the ContactType enum */
  public ContactType = ContactType;

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private teacherService: TeacherService,
    private activatedRoute: ActivatedRoute,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.pageService.setLoading(true);
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.teacherService.get(this.activatedRoute.snapshot.params.id).subscribe((response: GraphQLResponse<Teacher>) => {
        this.teacher = response.data;
        console.log('TEACHER:::', this.teacher);
        this.pageService.setTitle(this.teacher.firstName + ' ' + this.teacher.lastName);
        this.pageService.setLoading(false);
      });

      if (this.appContextService.hasPermission(Permission.TEACHER_IMPERSONATE)) {
        this.pageService.addFunctionAction(PageActions.impersonate, this.impersonate, [this.activatedRoute.snapshot.params.id]);
      }
      if (this.appContextService.hasPermission(Permission.STUDENT_ASSIGN)) {
        this.pageService.addRoutingAction(PageActions.students, ['/teacher', this.activatedRoute.snapshot.params.id, 'student']);
      }
      if (this.appContextService.hasPermission(Permission.TEACHER_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/teacher', this.activatedRoute.snapshot.params.id, 'edit']);
      }
      if (this.appContextService.hasPermission(Permission.TEACHER_DELETE)) {
        this.pageService.addFunctionAction(PageActions.delete, this.delete, [this.activatedRoute.snapshot.params.id]);
      }
    }
  }

  /**
   * Impersonates the teacher
   * @param id The id of the teacher to impersonate
   */
  public impersonate = (id: number): void => {
    this.pageService.setLoading(true);
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': this.cookieService.get('auth')
      })
    }
    this.http.post(this.appContextService.getEnvironmentVariable('authUrl') + '/impersonate', {id: this.teacher.id}, httpOptions).pipe(
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
   * Deletes the teacher
   * @param id The id of the teacher to delete
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Teacher',
        question: 'Are you sure you want to delete this teacher?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.teacherService.delete(id).pipe(
          take(1),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe(response => {
          if (response.success) {
            this.toastService.success('The teacher was deleted successfully!');
          }
          else {
            this.toastService.error('The teacher could not be deleted.');
          }
        });
      }
    });
  }

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

/**
 * TODO: CONTEXT SWITCHING
 * if we are in an invalid area for new context - switch:
 *    for example (switch context from GB to GT), if we are in Gaithersburg Context on center page (view/edit/etc.), switch to VIEW (always) for Germantown
 *    for example (switch context from All to GT), if we are on centers list page, switch to VIEW page for GT
 *    similarly (switch context from All to GT), if we are on students list page, switch from /students to center/1/students
 *
 * THE CONVENTION WILL BE, UPON CONTEXT SWITCH - GO TO DEFAULT PAGE FOR THE TOP ROOT YOU ARE IN
 */
