import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthorService, ConfirmDialogComponent, Permission, DatatableDataRequest, GraphQLResponse, Author } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sm-author-list',
  templateUrl: './author-list.component.html'
})
export class AuthorListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  
  /** 
   * Subject of current author data, we need this to trigger changes to the data source from this end
   */
  public authors: Subject<GraphQLResponse<Author[]>> = new BehaviorSubject<GraphQLResponse<Author[]>>({
    loading: true,
    data: []
  });

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private authorService: AuthorService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle( 'Authors' );
    if (this.appContextService.hasPermission(Permission.AUTHOR_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/authors', 'create']);
    }
  }

  /**
   * Loads author data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.authors.next({
      loading: true,
      data: []
    });

    // update data 
    this.authorService.getAll({
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
    }).pipe(take(1)).subscribe((authors: GraphQLResponse<Author[]>) => {
      this.authors.next(authors);
    });
  }

  /**
   * Deletes the author
   * @param id The id of the author to be deleted
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Author',
        question: 'Are you sure you want to delete this author?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.authorService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The author was deleted successfully!');
            }
            else{
                this.toastService.error('The author could not be deleted.');
            }
        });
      }
    });
  }
}
