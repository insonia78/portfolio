import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize, debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AssignmentService, ConfirmDialogComponent, Permission, DatatableDataRequest, GraphQLResponse, Assignment, Level, LevelService, GraphQLQueryFilter } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sm-assignment-list',
  templateUrl: './assignment-list.component.html'
})
export class AssignmentListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  
  /** 
   * Subject of current assignment data, we need this to trigger changes to the data source from this end
   */
  public assignments: Subject<GraphQLResponse<Assignment[]>> = new BehaviorSubject<GraphQLResponse<Assignment[]>>({
    loading: true,
    data: []
  });

  /**
   * Form control to facilitate subject/level filtering
   */
  public levelFilter = new FormControl([]);

  /**
   * Current subject/level limitation selection
   */
  public currentLevels: Level[] = [];

  /**
   * List of available levels
   */
  public availableLevels: Level[] = [];

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
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private assignmentService: AssignmentService,
    private levelService: LevelService,
    public pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Manage Assignments');
    this.levelService.getAll().pipe(take(1)).subscribe(levels => this.availableLevels = levels.data.map(level => {
      level.subjectName = level.subject.name;
      return level; 
    }));
    this.levelFilter.valueChanges.pipe(debounceTime(500)).subscribe(levels => {
      this.currentLevels = levels;
      this.loadData(this.currentTableSettings);
    })
    setTimeout(()=> console.log(this.availableLevels), 10);
    if (this.appContextService.hasPermission(Permission.ASSIGNMENT_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/assignment', 'create']);
    }
  }

  /**
   * Loads assignment data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.assignments.next({
      loading: true,
      data: []
    });

    this.currentTableSettings = event;

    // define filters
    const filters: GraphQLQueryFilter[] = [];
    // handle level constraint
    if (this.currentLevels.length > 0) {
      filters.push({
        field: "level",
        values: this.currentLevels.map(level => level.id),
        comparison: "in"
      });
    }
    // handle table filter constraint
    filters.push({ field: 'title', value: event.filter, comparison: 'contains' });

    // update data 
    this.assignmentService.getAll({
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: event.sort,
        direction: event.order
      },
      filters: filters
    }).pipe(take(1)).subscribe((assignments: GraphQLResponse<Assignment[]>) => {
      this.assignments.next(assignments);
    });
  }

  /**
   * Deletes the assignments
   * @param id The id of the assignment to be deleted
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Assignment',
        question: 'Are you sure you want to delete this assignment?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.assignmentService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The assignment was deleted successfully!');
            }
            else{
                this.toastService.error('The assignment could not be deleted.');
            }
        });
      }
    });
  }
}
