import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, LevelService, Level, Subject, SubjectService, ConfirmDialogComponent, Permission, DatatableDataRequest } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sm-subject-level-list',
  templateUrl: './subject-level-list.component.html'
})
export class SubjectLevelListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /**
   * The current subject id
   */
  public subjectId: number = null;

  /** 
   * Subject of current level data, we need this to trigger changes to the data source from this end
   */
  public levels: BehaviorSubject<GraphQLResponse<Level[]>> = new BehaviorSubject<GraphQLResponse<Level[]>>({
    loading: true,
    data: []
  });

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private activatedRoute: ActivatedRoute,
    private levelService: LevelService,
    private subjectService: SubjectService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Manage Levels');

    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.subjectId = this.activatedRoute.snapshot.params.id;

      // get subject name for title
      this.subjectService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((subject: GraphQLResponse<Subject>) => {
        this.pageService.setTitle('Manage Levels for ' + subject.data.name);        
      });

      if (this.appContextService.hasPermission(Permission.LEVEL_CREATE)) {
        this.pageService.addRoutingAction(PageActions.create, ['/subject', this.subjectId, 'level', 'create']);
      }
    }
  }

  /**
   * Loads level data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.levels.next({
      loading: true,
      data: []
    });

    // update data 
    this.levelService.getAllFromSubject(this.subjectId, {
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
    }).pipe(take(1)).subscribe((levels: GraphQLResponse<Level[]>) => {
      this.levels.next(levels);
    });
  }

  /**
   * Deletes the level
   * @param id The id of the level which should be deleted
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Level',
        question: 'Are you sure you want to delete this level?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.levelService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The level was deleted successfully!');
            }
            else{
                this.toastService.error('The level could not be deleted.');
            }
        });
      }
    });
  }
}
