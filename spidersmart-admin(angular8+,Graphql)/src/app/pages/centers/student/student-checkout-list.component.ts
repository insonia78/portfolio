import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, forkJoin, throwError } from 'rxjs';
import { take, catchError, finalize } from 'rxjs/operators';
import { Student, GraphQLResponse, AssignmentSubmissionService, AssignmentSubmission, Permission, StudentService, Enrollment, Book, BookSelectorDialogComponent, BookService, BookCheckout, DatatableDataRequest, GraphQLQueryFilter } from '@spidersmart/ng';
import { PageService, AppContextService, PageActions, AppContextCenter } from '@spidersmart/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

/**
 * Component to display list of all book checkouts
 */
@Component({
  selector: 'sm-student-checkout-list',
  templateUrl: './student-checkout-list.component.html'
})
export class StudentCheckoutListComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /** 
   * Subject of current student data, we need this to trigger changes to the data source from this end 
   */
  public checkouts: BehaviorSubject<GraphQLResponse<BookCheckout[]>> = new BehaviorSubject<GraphQLResponse<BookCheckout[]>>({
    loading: true,
    data: []
  });

  /**
   * Reference to student previous checkouts, used to determine if the books to be added have ever been previously checked out
   */
  private get returnedCheckouts(): Book[] {
    let checkouts = [];
    if (this.student) {
      this.student.enrollments.forEach((enrollment: Enrollment) => {
        if (enrollment && enrollment.hasOwnProperty('books') && enrollment.books.length > 0) {
          checkouts = [...checkouts, ...enrollment.books.filter(book => book.relatedTo !== null)];
        }
      });
    }
    return checkouts;
  }

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
   * Reference to the current users accessible centers
   */
  private accessibleCenters: AppContextCenter[] = [];

  /** 
   * Reference to student id 
   */
  private studentId = null;

  /** 
   * Reference to student details 
   */
  private student: Student = null;

  /** 
   * Subject to ensure all subscriptions close when element is destroyed 
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * @ignore
   */
  constructor(
    private studentService: StudentService,
    private bookService: BookService,
    private submissionService: AssignmentSubmissionService,
    private appContextService: AppContextService,
    private pageService: PageService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.appContextService.getAccessibleCenters().pipe(take(1)).subscribe(centers => {
      this.accessibleCenters = centers;
    });
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.studentId = this.activatedRoute.snapshot.params.id;
      this.studentService.get(this.studentId).pipe(take(1)).subscribe((student: GraphQLResponse<Student>) => {
        this.student = student.data;
      });
      if (this.appContextService.hasPermission(Permission.STUDENT_UPDATE)) {
        this.pageService.addFunctionAction(PageActions.create, this.checkoutBook, [this.activatedRoute.snapshot.params.id]);
      }
    }
    this.pageService.setTitle('Book Checkouts');
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Loads student checkout data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
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

    if (this.studentId) {
      // determine center constraint and update data
      this.studentService.getBookCheckouts(this.studentId, {
        page: {
          size: event.limit,
          start: event.offset
        },
        sort: {
          field: (event.sort === 'lastName') ? 'name' : event.sort,
          direction: event.order
        },
        filters: filters
      }).pipe(take(1)).subscribe((checkouts: GraphQLResponse<BookCheckout[]>) => {
        this.checkouts.next(checkouts);
      });
    }
  }


  /**
   * Checkout a new book or books
   */
  public checkoutBook = () => {
    // can't checkout a book without a student loaded
    if (!this.student) {
      return;
    }

    // this will need to be restricted based on permissions - and later, based on the enrollments which align between the teacher/director
    const checkoutBookDialog = this.dialog.open(BookSelectorDialogComponent, {
      width: '500px',
      data: {
        mode: 'search',
        title: 'Checkout Book',
        description: 'Choose the book(s) you would like to checkout for this student:',
        excludedBooks: this.checkouts.getValue().data.map(checkout => checkout.book) as Book[],
        confirmationRequiredBooks: this.returnedCheckouts.map(checkout => checkout.book) as Book[],
        confirmationTitle: 'Previously Checked Out',
        confirmationMessage: 'This book was previously checked out by this student.  Are you sure you want to check it out again?',
        accessibleCenters: this.accessibleCenters,
        availableEnrollments: this.student.enrollments
      }
    });

    checkoutBookDialog.afterClosed().subscribe((selections: { enrollment: Enrollment, books: Book[] }) => {
      if (selections && selections.enrollment && selections.books && selections.books.length > 0) {
        this.pageService.setLoading(true);

        // this will be used to watch for completion of all books to trigger the assignment mapping and response
        const checkoutWatcher: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
        // list of assignment ids to checkout
        const checkoutAssignments = [];
        // keep track of various types of errors
        let checkoutErrors = 0;
        let noAssignmentErrors = 0;
        let assignmentErrors = 0;

        // build a list of request to make, one for each new book that is to be checked out
        const requests = [];
        selections.books.forEach(book => {
          requests.push(this.bookService.checkout(
            selections.enrollment,
            book
          ));
        });

        // send the requests
        forkJoin(requests).pipe(
          catchError((err) => {
            this.pageService.setLoading(false);
            this.toastService.error('The book(s) could not be checked out.');
            return throwError(err);
          }),
          finalize(() => {
            checkoutWatcher.next(true);
          })
        ).subscribe((response: GraphQLResponse<Book>[]) => {
          // update the checkouts list with any successfully checked out books and keep track of how many errors exist
          response.forEach((result: GraphQLResponse<Book>) => {
            if (result.success && result.data) {
              // make sure there is an assignment and set it to pending assignments to add
              if (result.data.book && result.data.book.assignment) {
                checkoutAssignments.push({
                  assignmentId: result.data.book.assignment.id,
                  checkoutId: result.data.id
                });
              } else {
                noAssignmentErrors++;
              }              
            } else {
              checkoutErrors++;
            }
          });

          // show the correct response based on how many errors occurred and update the checkouts list if necessary
          if (checkoutErrors >= requests.length) {
            this.toastService.error('The book(s) could not be checked out.');
          } else {
            if (checkoutErrors > 0) {
              this.toastService.warning(checkoutErrors + ' of the ' + requests.length + ' book(s) failed to checkout.');
            } else {
              this.toastService.success('The book(s) were checked out successfully!');
            }

            if (noAssignmentErrors > 0) {
              this.toastService.warning('No assignment was found for ' + noAssignmentErrors + ' of the book(s).');
            }
          }
        });

        // next assignments for each new book need to be assigned
        checkoutWatcher.subscribe(isComplete => {
          if (isComplete === true && checkoutErrors < requests.length) {
            checkoutWatcher.unsubscribe();

            // build requests to run for assignment mapping
            const assignmentRequests = [];
            checkoutAssignments.forEach(checkout => {
              assignmentRequests.push(
                this.submissionService.create({
                  enrollment: { id: selections.enrollment.id },
                  assignment: { id: checkout.assignmentId},
                  bookCheckoutId: checkout.checkoutId
                } as AssignmentSubmission)
              );
            });

            // map assignments
            forkJoin(assignmentRequests).pipe(
              catchError((err) => {
                this.pageService.setLoading(false);                
                this.toastService.error('The assignment(s) for the new checkouts could not be assigned.');
                return throwError(err);
              }),
              finalize(() => {
                this.pageService.setLoading(false);
              })
            ).subscribe((assignmentResponse: GraphQLResponse<AssignmentSubmission>[]) => {
              assignmentResponse.forEach((result: GraphQLResponse<AssignmentSubmission>) => {
                if (!result.success) {
                  assignmentErrors++;
                }
              });

              // show messaging for assignments
              if(assignmentErrors > 0) {
                this.toastService.warning('The assignment failed to assign for ' + assignmentErrors + ' of the book(s).');
              }

              this.loadData(this.currentTableSettings);
            });
          }
        });


      }
    });
  }

  /**
   * Returns checked out books
   * @param books The book(s) to return
   */
  public returnBook = (books: BookCheckout | BookCheckout[]): void => {
    books = (!Array.isArray(books)) ? [books] : books;
    this.pageService.setLoading(true);

    // build a list of request to make, one for each book that is to be returned
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
    ).subscribe((response: GraphQLResponse<Book>[]) => {
      // update the checkouts list with returned books
      let errors = 0;
      for (let i = 0; i < response.length; i++) {
        const result: GraphQLResponse<Book> = response[i];
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
        this.loadData(this.currentTableSettings);
      }
    });
  };
}
