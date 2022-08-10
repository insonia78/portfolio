import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Book, GraphQLResponse, BookService, ConfirmDialogComponent, Permission } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

@Component({
  selector: 'sm-approved-book-view',
  templateUrl: './approved-book-view.component.html',
  styleUrls: ['./approved-book-view.component.scss']
})
export class ApprovedBookViewComponent implements OnInit {
  /**
   * The current book
   */
  public book: Book;

  /**
   * The placeholder image to show when an image is loading or has failed to load
   */
  get placeholderImage(): string {
    return this.appContextService.getEnvironmentVariable('placeholderImage');
  }

  constructor(
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appContextService: AppContextService,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog
  ) {
    this.pageService.setTitle('Book Details');
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.bookService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Book>) => {
        this.book = response.data;

        if (this.appContextService.hasPermission(Permission.ASSIGNMENT_VIEW) && this.book.assignment) {
          this.pageService.addRoutingAction(PageActions.assignment, ['/assignment', this.book.assignment.id, 'view']);
        }
        if (this.appContextService.hasPermission(Permission.BOOK_UPDATE)) {
          this.pageService.addRoutingAction(PageActions.edit, ['/approved-books', this.activatedRoute.snapshot.params.id, 'edit']);
        }
        if (this.appContextService.hasPermission(Permission.BOOK_DELETE)) {
          this.pageService.addFunctionAction(PageActions.delete, this.delete);
        }
      });
    }
  }

  /**
   * Deletes the book
   */
  public delete = () => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Book',
        question: 'Are you sure you want to delete this book?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.bookService.delete(this.activatedRoute.snapshot.params.id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The book was deleted successfully!');
                this.router.navigate(['/books']);
            }
            else{
                this.toastService.error('The book could not be deleted.');
            }
        });
      }
    });
  }
}
