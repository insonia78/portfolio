import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BookService, ConfirmDialogComponent, Permission, DatatableDataRequest, GraphQLResponse, Book } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sm-approved-book-list',
  templateUrl: './approved-book-list.component.html',
})
export class ApprovedBookListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /** 
   * Subject of current book data, we need this to trigger changes to the data source from this end 
   */
  public approvedBooks: Subject<GraphQLResponse<Book[]>> = new BehaviorSubject<GraphQLResponse<Book[]>>({
    loading: true,
    data: []
  });

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private bookService: BookService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle( 'Approved Books' );
    if (this.appContextService.hasPermission(Permission.BOOK_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/approved-books', 'create']);
    }
  }

  /**
   * Loads book data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.approvedBooks.next({
      loading: true,
      data: []
    });

    this.bookService.getAll({
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: (event.sort === 'lastName') ? 'name' : event.sort,
        direction: event.order
      },
      filters: [
        { field: 'title', value: event.filter, comparison: 'contains' }
      ]
    }).pipe(take(1)).subscribe((books: GraphQLResponse<Book[]>) => {
      this.approvedBooks.next(books);
    });
  }

  /**
   * Deletes the books
   * @param id The id of the book to be deleted
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Book',
        question: 'Are you sure you want to delete this book?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.bookService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The book was deleted successfully!');
            }
            else{
                this.toastService.error('The book could not be deleted.');
            }
        });
      }
    });
  }
}
