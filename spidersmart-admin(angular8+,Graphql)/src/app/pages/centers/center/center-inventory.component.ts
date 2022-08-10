import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, throwError, forkJoin, Observable } from 'rxjs';
import { take, finalize, catchError, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CenterService, Center, Book, GraphQLResponse, ConfirmDialogComponent, BookSelectorDialogComponent, Permission, Enrollment, DatatableDataRequest } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

@Component({
  selector: 'sm-center-inventory',
  templateUrl: './center-inventory.component.html',
  styleUrls: ['./center-inventory.component.scss']
})
export class CenterInventoryComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /** 
   * Reference to the current center
   */
  public center: Center;

  /** 
   * Subject of current book inventory data, we need this to trigger changes to the data source from this end
   */
  public books: BehaviorSubject<GraphQLResponse<Book[]>> = new BehaviorSubject<GraphQLResponse<Book[]>>({
    loading: true,
    data: []
  });

  /**
   * The quantity of the book which is currently being edited
   */
  public currentQuantity = 0;

  /**
   * The row index of the book which is currently being edited
   */
  private currentlyEditing: number = null;

  /** 
   * Subject to ensure all subscriptions close when element is destroyed
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * @ignore 
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private appContextService: AppContextService,
    public fb: FormBuilder,
    private centerService: CenterService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setLoading(true);
    this.pageService.setTitle('Manage Book Inventory');

    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.centerService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((center: GraphQLResponse<Center>) => {
        this.center = center.data;
        this.pageService.setLoading(false);
      });
    }
    if (this.appContextService.hasPermission(Permission.CENTER_MANAGE_BOOKS)) {
      this.pageService.addFunctionAction(PageActions.create, this.addBook, [this.activatedRoute.snapshot.params.id]);
    }
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Loads book inventory list
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.books.next({
      loading: true,
      data: []
    });

    // update data 
    this.centerService.getBooks(this.center.id, {
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: event.sort,
        direction: event.order
      },
      filters: [
        { field: 'title', value: event.filter, comparison: 'contains' }
      ]
    }).pipe(take(1)).subscribe((books: GraphQLResponse<Book[]>) => {
      this.books.next(books);
    });
  }

  /**
   * Accessor to determine if the given book is currently having the quantity edited
   */
  public inEditMode = (id: number) => {
    return (this.currentlyEditing === id);
  }

  /**
   * Saves the pending quantity
   * @param book The book for which the quantity should be updated
   * @param quantity The new quantity of the book in stock
   */
  public saveQuantity(book: Book, quantity: number) {
    book.quantity = quantity;
    this.centerService.setBookQuantity(this.center, book, quantity).pipe(
      take(1),
      catchError((err) => {
        this.toastService.error('The quantity could not be updated.');
        return throwError(err);
      }),
      finalize(() => {
        this.pageService.setLoading(false);
      })
    ).subscribe(response => {
      if (response.success) {
        this.toastService.success('The quantity was updated successfully!');
        this.toggleQuantityEdit(this.currentlyEditing);
      }
    });
  }

  /**
   * Add new book(s) to the inventory
   */
  public addBook = () => {
    console.log('excluding::', this.books.getValue().data);
    const addBookDialog = this.dialog.open(BookSelectorDialogComponent, {
      width: '500px',
      data: {
        title: 'Add Books',
        description: 'Choose the book(s) you would like to add to the inventory:',
        excludedBooks: this.books.getValue().data,
        mode: 'browse'
      }
    });

    addBookDialog.afterClosed().subscribe((selections: { enrollment: Enrollment, books: Book[] }) => {
      if (selections && selections.books && selections.books.length > 0) {
        this.pageService.setLoading(true);

        // build a list of request to make, one for each new assignment that is to be assigned
        const requests = [];
        selections.books.forEach(book => {
          requests.push(this.centerService.setBookQuantity(this.center, book, 1));
        });

        // send the requests
        forkJoin(requests).pipe(
          catchError((err) => {
            this.pageService.setLoading(false);
            this.toastService.error('The book(s) could not be added to the inventory.');
            return throwError(err);
          }),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe((response: GraphQLResponse<Book>[]) => {
          // keep track of how many errors exist and show the appropriate response
          let errors = 0;
          response.forEach((result: GraphQLResponse<Book>) => {
            if (!result.success) {
              errors++;
            }
          })

          // show the correct response based on how many errors occurred and update the submissions list if necessary
          if (errors >= requests.length) {
            this.toastService.error('The book(s) could not be added to the inventory.');
          } else {
            if (errors > 0) {
              this.toastService.warning(errors + ' of the ' + requests.length + ' books failed to add to the inventory.');
            } else {
              this.toastService.success('The books(s) were added successfully!');
            }
          }
        });
      }
    });
  }

  /**
   * Toggles a given book in the inventory between edit mode and readonly mode
   * @param id The id of the book to edit
   * @param quantity The current quantity of the book in stock
   */
  public toggleQuantityEdit = (id: number, quantity = 0) => {
    this.currentQuantity = (this.currentlyEditing === id) ? 0 : quantity;
    this.currentlyEditing = (this.currentlyEditing === id) ? null : id;
  }

  /**
   * Removes existing book from the center inventory
   * @param book The book to remove
   */
  public removeBook = (book: Book) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove Book',
        question: 'Are you sure you want to remove this book from the inventory?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.pageService.setLoading(true);

        this.centerService.deleteBook(this.center, book).pipe(
          take(1),
          catchError((err) => {
            this.pageService.setLoading(false);
            this.toastService.error('The book could not be removed.');
            return throwError(err);
          }),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe(response => {
          if (response.success) {
            const updatedBooks = this.books.getValue();
            const bookIndex = updatedBooks.data.findIndex(curBook => curBook.id === book.id);
            if (bookIndex > -1) {
              updatedBooks.data.splice(bookIndex, 1);
              this.books.next(updatedBooks);
            }
            this.toastService.success('The book was removed successfully!');
          }
        });
      }
    });
  }
}
