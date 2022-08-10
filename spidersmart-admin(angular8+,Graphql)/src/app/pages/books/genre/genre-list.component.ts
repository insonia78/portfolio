import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GenreService, ConfirmDialogComponent, Permission, GraphQLResponse, Genre, DatatableDataRequest } from '@spidersmart/ng';
import { PageService, PageActions, AppContextService } from '@spidersmart/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sm-genre-list',
  templateUrl: './genre-list.component.html'
})
export class GenreListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  
  /** 
   * Subject of current genre data, we need this to trigger changes to the data source from this end
   */
  public genres: Subject<GraphQLResponse<Genre[]>> = new BehaviorSubject<GraphQLResponse<Genre[]>>({
    loading: true,
    data: []
  });

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private genreService: GenreService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Genres');
    if (this.appContextService.hasPermission(Permission.GENRE_CREATE)) {
      this.pageService.addRoutingAction(PageActions.create, ['/genre', 'create']);
    }
  }

  /**
   * Loads genre data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.genres.next({
      loading: true,
      data: []
    });

    // update data 
    this.genreService.getAll({
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
    }).pipe(take(1)).subscribe((genres: GraphQLResponse<Genre[]>) => {
      this.genres.next(genres);
    });
  }

  /**
   * Deletes the genres
   * @param id The id of the genre which should be deleted
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Genre',
        question: 'Are you sure you want to delete this genre?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.genreService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The genre was deleted successfully!');
            }
            else{
                this.toastService.error('The genre could not be deleted.');
            }
        });
      }
    });
  }


}
