import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, PublisherService, Publisher, ConfirmDialogComponent, Permission } from '@spidersmart/ng';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

@Component({
  selector: 'sm-publisher-view',
  templateUrl: './publisher-view.component.html',
  styleUrls: ['./publisher-view.component.scss']
})
export class PublisherViewComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /** 
   * The current publisher 
   */
  public publisher: Publisher;

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
    private publisherService: PublisherService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private toastService: ToastrService,
    private dialog: MatDialog
  ) {
    this.pageService.setTitle('Publisher Details');
  }

  /**
   * @ignore
   */
  ngOnInit() {
    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.publisherService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Publisher>) => {
        this.publisher = response.data;
      });

      if (this.appContextService.hasPermission(Permission.PUBLISHER_UPDATE)) {
        this.pageService.addRoutingAction(PageActions.edit, ['/publisher', this.activatedRoute.snapshot.params.id, 'edit']);
      }
      if (this.appContextService.hasPermission(Permission.PUBLISHER_DELETE)) {
        this.pageService.addFunctionAction(PageActions.delete, this.delete);
      }
    }
  }

  /**
   * Deletes the publisher
   */
  public delete = () => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Publisher',
        question: 'Are you sure you want to delete this publisher?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.publisherService.delete(this.activatedRoute.snapshot.params.id).pipe(
          take(1),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe(response => {
          if (response.success) {
            this.toastService.success('The publisher was deleted successfully!');
            this.router.navigate(['/publisher']);
          }
          else {
            this.toastService.error('The publisher could not be deleted.');
          }
        });
      }
    });
  }
}
