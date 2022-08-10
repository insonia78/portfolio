import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, BehaviorSubject, forkJoin, throwError } from 'rxjs';
import { take, takeUntil, finalize, map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  AssignmentSubmissionService,
  AssignmentSubmission,
  Center,
  GraphQLResponse,
  ConfirmDialogComponent,
  BookCheckout,
  Permission,
  GraphQLQueryFilter,
  DatatableDataRequest,
  GraphQLQueryOptions,
  Teacher,
  CenterService,
  BookService
} from '@spidersmart/ng';
import { PageService, AppContextService } from '@spidersmart/core';

/**
 * Component to display list of all assignment submissions
 */
@Component({
  selector: 'sm-book-checkout-list',
  templateUrl: './book-checkout-list.component.html',
  styleUrls: ['./book-checkout-list.component.scss']
})
export class BookCheckoutListComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /**
   * Reference to the current user id
   */
  private userId: number = null;

  /** Subject of current student data, we need this to trigger changes to the data source from this end */
  public checkouts: BehaviorSubject<GraphQLResponse<BookCheckout[]>> = new BehaviorSubject<GraphQLResponse<BookCheckout[]>>({
    loading: true,
    data: []
  });

  /** 
   * List of centers for which checkouts are currently displaying 
   */
  private centers: Center[] = [];

  /**
   * The current table settings of the submissions table
   */
  private currentTableSettings: DatatableDataRequest = {
    limit: 10,
    offset: 0,
    sort: 'title',
    order: 'asc',
    filter: ''
  };

  /** 
   * Subject to ensure all subscriptions close when element is destroyed
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * The placeholder image to show when an image is loading or has failed to load
   */
  get placeholderImage(): string {
    return this.appContextService.getEnvironmentVariable('placeholderImage');
  }

  /**
   * @ignore
   */
  constructor(
    private centerService: CenterService,
    private bookService: BookService,
    private pageService: PageService,
    private appContextService: AppContextService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Book Checkouts');

    // set data source to reload (and potentially change) based on changes in center context
    combineLatest([
      this.appContextService.getCenter(),
      this.appContextService.getAccessibleCenters(),
      this.appContextService.getUserId()
    ]).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(([center, accessibleCenters, userId]) => {
      this.centers = ((center !== null) ? [center] : accessibleCenters) as Center[];
      this.userId = userId;
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
   * Loads the checkouts for the table
   */
  public loadCheckouts(event: DatatableDataRequest): void {
    this.checkouts.next({
      loading: true,
      data: []
    });

    // update current display options from request
    this.currentTableSettings = event;

    // derive the filters to send based on user-defined selections
    const filters: GraphQLQueryFilter[] = [];

    // if there are event filters
    if (event.filter) {
      filters.push({
        field: 'title',
        value: event.filter,
        comparison: 'contains'
      });
    }

    // get updated checkouts
    this.centerService.getBookCheckouts(this.centers,{
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: event.sort,
        direction: event.order
      },
      filters: filters
    }).pipe(take(1)).subscribe((checkouts: GraphQLResponse<BookCheckout[]>) => {
        this.checkouts.next(checkouts);
    });
  }

  /**
   * Returns checked out books
   * @param books The book(s) to return
   */
  public returnBook = (books: BookCheckout | BookCheckout[]): void => {
    books = (!Array.isArray(books)) ? [books] : books;
    this.pageService.setLoading(true);

    // build a list of request to make, one for each new book that is to be checked out
    const requests = [];
    books.forEach(book => {
      requests.push(this.bookService.return(book));
    });

    // send the requests
    forkJoin(requests).pipe(
      catchError((err) => {
        this.pageService.setLoading(false);
        this.toastService.error('The book(s) could not be returned.');
        return throwError(err);
      }),
      finalize(() => {
        this.pageService.setLoading(false);
      })
    ).subscribe((response: GraphQLResponse<BookCheckout>[]) => {
      // update the checkouts list with any successfully checked out books and keep track of how many errors exist
      let errors = 0;
      for (let i = 0; i < response.length; i++) {
        const result: GraphQLResponse<BookCheckout> = response[i];
        if (!result.success) {
          errors++;
        }
      }

      // show the correct response based on how many errors occurred and update the checkouts list if necessary
      if (errors >= requests.length) {
        this.toastService.error('The book(s) could not be returned.');
      } else {
        if (errors > 0) {
          this.toastService.warning(errors + ' of the ' + requests.length + ' book(s) failed to return.');
        } else {
          this.toastService.success('The book(s) were returned successfully!');
        }
        this.loadCheckouts(this.currentTableSettings);
      }
    });
  };
}
