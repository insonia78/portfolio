import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { PublisherService, ConfirmDialogComponent, Permission, GraphQLResponse, Publisher, DatatableDataRequest } from '@spidersmart/ng';
import { PageService, PageActions, AppContextService } from '@spidersmart/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sm-publisher-list',
  templateUrl: './publisher-list.component.html'
})
export class PublisherListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  
  /** 
   * Subject of current publisher data, we need this to trigger changes to the data source from this end
   */
  public publishers: Subject<GraphQLResponse<Publisher[]>> = new BehaviorSubject<GraphQLResponse<Publisher[]>>({
    loading: true,
    data: []
  });

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private publisherService: PublisherService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Publishers');
    if (this.appContextService.hasPermission(Permission.PUBLISHER_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/publisher', 'create']);
    }
  }

  /**
   * Loads publisher data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.publishers.next({
      loading: true,
      data: []
    });

    // update data 
    this.publisherService.getAll({
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
    }).pipe(take(1)).subscribe((publishers: GraphQLResponse<Publisher[]>) => {
      this.publishers.next(publishers);
    });
  }

  /**
   * Deletes the publishers
   * @param id The id of the publisher to delete
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Publisher',
        question: 'Are you sure you want to delete this publisher?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.publisherService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The publisher was deleted successfully!');
            }
            else{
                this.toastService.error('The publisher could not be deleted.');
            }
        });
      }
    });
  }
}
