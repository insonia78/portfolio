import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SubjectService, ConfirmDialogComponent, Permission, GraphQLResponse, Subject as AssignmentSubject, DatatableDataRequest } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sm-subject-list',
  templateUrl: './subject-list.component.html'
})
export class SubjectListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  
  /** 
   * Subject of current subject data, we need this to trigger changes to the data source from this end
   */
  public subjects: Subject<GraphQLResponse<AssignmentSubject[]>> = new BehaviorSubject<GraphQLResponse<AssignmentSubject[]>>({
    loading: true,
    data: []
  });

  /**
   * @ignore
   */  
  constructor(
    private appContextService: AppContextService,
    private subjectService: SubjectService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Manage Subjects');
    if (this.appContextService.hasPermission(Permission.SUBJECT_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/subject', 'create']);
    }
  }

  /**
   * Loads subject data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.subjects.next({
      loading: true,
      data: []
    });

    // update data
    this.subjectService.getAll({
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: event.sort,
        direction: event.order
      },
      filters: [
        { field: 'name', value: event.filter, comparison: 'contains' }
      ]
    }).pipe(take(1)).subscribe((subjects: GraphQLResponse<AssignmentSubject[]>) => {
      this.subjects.next(subjects);
    });
  }

  /**
   * Deletes the subject
   * @param id The id of the subject to be deleted
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Subject',
        question: 'Are you sure you want to delete this subject?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.subjectService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The subject was deleted successfully!');
            }
            else{
                this.toastService.error('The subject could not be deleted.');
            }
        });
      }
    });
  }
}
