import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subject, GraphQLResponse, SubjectService, ConfirmDialogComponent, Permission } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

@Component({
  selector: 'sm-subject-view',
  templateUrl: './subject-view.component.html'
})
export class SubjectViewComponent implements OnInit {
  /**
   * The current subject
   */
  public subject: Subject;

  constructor(
    private appContextService: AppContextService,
    private subjectService: SubjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog
  ) {
    this.pageService.setTitle('Subject Details');
   }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.subjectService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Subject>) => {
        this.subject = response.data;
      });

      if (this.appContextService.hasPermission(Permission.LEVEL_VIEW)) {
        this.pageService.addRoutingAction(PageActions.levels, ['/subject', this.activatedRoute.snapshot.params.id, 'level']);
      }
      if (this.appContextService.hasPermission(Permission.SUBJECT_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/subject', this.activatedRoute.snapshot.params.id, 'edit']);
      }
      if (this.appContextService.hasPermission(Permission.SUBJECT_DELETE)) {
        this.pageService.addFunctionAction(PageActions.delete, this.delete);
      }
    }
  }

  /**
   * Deletes the subject
   */
  public delete = () => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Subject',
        question: 'Are you sure you want to delete this subject?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.subjectService.delete(this.activatedRoute.snapshot.params.id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The subject was deleted successfully!');
                this.router.navigate(['/subjects']);
            }
            else{
                this.toastService.error('The subject could not be deleted.');
            }
        });
      }
    });
  }
}
