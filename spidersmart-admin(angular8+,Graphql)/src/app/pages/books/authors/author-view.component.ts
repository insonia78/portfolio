import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, Author, AuthorService, ConfirmDialogComponent, Permission } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

@Component({
  selector: 'sm-author-view',
  templateUrl: './author-view.component.html',
  styleUrls: ['./author-view.component.scss']
})
export class AuthorViewComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  /**
   * The current author
   */
  public author: Author;

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
    private appContextService: AppContextService,
    private authorService: AuthorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog
  ) {
    this.pageService.setTitle('Author Details');
  }

  /**
   * @ignore
   */
  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.authorService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Author>) => {
        this.author = response.data;
      });

      if (this.appContextService.hasPermission(Permission.AUTHOR_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/authors', this.activatedRoute.snapshot.params.id, 'edit']);
      }
      if (this.appContextService.hasPermission(Permission.AUTHOR_DELETE)) {
        this.pageService.addFunctionAction(PageActions.delete, this.delete);
      }
    }
  }

  /**
   * Deletes the author
   */
  public delete = () => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Author',
        question: 'Are you sure you want to delete this author?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.authorService.delete(this.activatedRoute.snapshot.params.id).pipe(
          take(1),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe(response => {
          if (response.success) {
            this.toastService.success('The author was deleted successfully!');
            this.router.navigate(['/authors']);
          }
          else {
            this.toastService.error('The author could not be deleted.');
          }
        });
      }
    });
  }
}
