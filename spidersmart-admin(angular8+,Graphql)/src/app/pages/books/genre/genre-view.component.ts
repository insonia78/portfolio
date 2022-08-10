import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Genre, GraphQLResponse, GenreService, ConfirmDialogComponent, Permission } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

@Component({
  selector: 'sm-genre-view',
  templateUrl: './genre-view.component.html',
  styleUrls: ['./genre-view.component.scss']
})
export class GenreViewComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  /** The current center */
  public genre: Genre;

  /**
   * The placeholder image to show when an image is loading or has failed to load
   */
  get placeholderImage(): string {
    return this.appContextService.getEnvironmentVariable('placeholderImage');
  }

  constructor(
    private appContextService: AppContextService,
    private genreService: GenreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog
  ) {
    this.pageService.setTitle('Genre Details');
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.genreService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Genre>) => {
        this.genre = response.data;
      });

      if (this.appContextService.hasPermission(Permission.GENRE_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/genre', this.activatedRoute.snapshot.params.id, 'edit']);
      }
      if (this.appContextService.hasPermission(Permission.GENRE_DELETE)) {
        this.pageService.addFunctionAction(PageActions.delete , this.delete);
      }
    }
  }
  /**
   * Deletes the genre
   */
  public delete = () => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Genre',
        question: 'Are you sure you want to delete this genre?'
      }
    });
     
    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
    
      if (confirmed === true) {
        this.genreService.delete(this.activatedRoute.snapshot.params.id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The genre was deleted successfully!');
                this.router.navigate(['/genre']);
            }
            else{
                this.toastService.error('The genre could not be deleted.');
            }
        });
      }
    });
  }
}
