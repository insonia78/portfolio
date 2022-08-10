import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, LevelService, ConfirmDialogComponent, Level, Permission } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

@Component({
  selector: 'sm-subject-level-view',
  templateUrl: './subject-level-view.component.html',
  styleUrls: ['./subject-level-view.component.scss']
})
export class SubjectLevelViewComponent implements OnInit {
  /**
   * The current level
   */
  public level: Level;

  constructor(
    private appContextService: AppContextService,
    private levelService: LevelService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.pageService.setTitle('Level Details');
    if (this.activatedRoute.snapshot.params.hasOwnProperty('levelId')) {
      this.levelService.get(this.activatedRoute.snapshot.params.levelId).pipe(take(1)).subscribe((response: GraphQLResponse<Level>) => {
        this.level = response.data;
        this.pageService.setTitle(response.data.name);
      });

      if (this.appContextService.hasPermission(Permission.LEVEL_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/subject', this.activatedRoute.snapshot.params.id, 'level', this.activatedRoute.snapshot.params.levelId, 'edit']);
      }
      if (this.appContextService.hasPermission(Permission.LEVEL_DELETE)) {
        this.pageService.addFunctionAction(PageActions.delete, this.delete);
      }
    }
  }

  /**
   * Deletes the level
   */
  public delete = () => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Level',
        question: 'Are you sure you want to delete this level?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.levelService.delete(this.activatedRoute.snapshot.params.levelId).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The level was deleted successfully!');
                this.router.navigate(['/subject', this.activatedRoute.snapshot.params.id, 'level']);
            }
            else{
                this.toastService.error('The level could not be deleted.');
            }
        });
      }
    });
  }
}
