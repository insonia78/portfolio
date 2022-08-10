import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize, map, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CenterService, ConfirmDialogComponent, Permission, AppContextCenter, Center } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';
import { combineLatest, Subject } from 'rxjs';


@Component({
  selector: 'sm-center-list',
  templateUrl: './center-list.component.html'
})
export class CenterListComponent implements OnInit, OnDestroy {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;
  public centers;
  /** used to destroy any subscriptions when component is destroyed */
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private appContextService: AppContextService,
    private centerService: CenterService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService,
    private router: Router
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    // set data source to reload (and potentially change) based on changes in center context
    combineLatest([
      this.appContextService.getCenter(),
      this.appContextService.getAccessibleCenters()
    ]).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(([center, accessibleCenters]) => {
      if (accessibleCenters && accessibleCenters.length > 0) {
        // if a center is selected or there is only one accessible center, route to view page for that center
        if (center !== null) {
          this.router.navigate(['/', 'center', center.id , 'view']);
        } else if (accessibleCenters.length === 1) {
          this.router.navigate(['/', 'center', accessibleCenters[0].id , 'view']);
        }
        this.centers = this.centerService.getAll(accessibleCenters.map((ctr: AppContextCenter) => Number(ctr.id)));
      }
    });

    this.pageService.setTitle('Manage Centers');
    this.pageService.addRoutingAction(PageActions.create, ['/center', 'create']);
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Deletes the centers
   */
  public delete = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Center',
        question: 'Are you sure you want to delete this center?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.centerService.delete(id).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success('The center was deleted successfully!');
            }
            else{
                this.toastService.error('The center could not be deleted.');
            }
        });
      }
    });
  }
}
