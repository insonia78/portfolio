import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { take, takeUntil, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Teacher, TeacherService, GraphQLResponse, ConfirmDialogComponent, Permission, AppContextCenter, DatatableDataRequest, Center } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

/**
 * Component to display list of all teachers
 */
@Component({
  selector: 'sm-teacher-list',
  templateUrl: './teacher-list.component.html'
})
export class TeacherListComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /** 
   * Subject of current teacher data, we need this to trigger changes to the data source from this end
   */
  public teachers: Subject<GraphQLResponse<Teacher[]>> = new BehaviorSubject<GraphQLResponse<Teacher[]>>({
    loading: true,
    data: []
  });

  /** 
   * List of centers for which teachers are currently displaying 
   */
  private centers: Center[] = [];

  /**
   * The current table settings of the teachers table
   */
  private currentTableSettings: DatatableDataRequest = {
    limit: 10,
    offset: 0,
    sort: 'name',
    order: 'asc',
    filter: ''
  };

  /** Subject to ensure all subscriptions close when element is destroyed */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * @ignore
   */
  constructor(
    private teacherService: TeacherService,
    private pageService: PageService,
    private appContextService: AppContextService,
    private dialog: MatDialog,
    private toastService: ToastrService,
    private cookieService: CookieService,
    private http: HttpClient
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Manage Teachers');
    if (this.appContextService.hasPermission(Permission.TEACHER_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/teacher', 'create']);
    }

    // set data source to reload (and potentially change) based on changes in center context
    combineLatest([
      this.appContextService.getCenter(),
      this.appContextService.getAccessibleCenters()
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(([center, accessibleCenters]) => {
      this.centers = ((center !== null) ? [center] : accessibleCenters) as Center[];
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
   * Loads teacher data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.teachers.next({
      loading: true,
      data: []
    });

    // update current display options from request
    this.currentTableSettings = event;

    // determine center constraint and update data
    this.teacherService.getAllFromCenter(this.centers.map(center => center.id), {
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
    }).pipe(take(1)).subscribe((teachers: GraphQLResponse<Teacher[]>) => {
      this.teachers.next(teachers);
    });
  }

  /**
   * Deletes the teachers
   * @param id The id of the teachers which should be deleted
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

  /**
   * Impersonates the teacher
   * @param teacher The teacher to impersonate
   */
  public impersonate = (teacher: Teacher): void => {
    this.pageService.setLoading(true);
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': this.cookieService.get('auth')
      })
    }
    this.http.post(this.appContextService.getEnvironmentVariable('authUrl') + '/impersonate', {id: teacher.id}, httpOptions).pipe(
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
}
