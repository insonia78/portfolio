import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppContextService, PageService } from '@spidersmart/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@spidersmart/ng';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public constructor(
    private appContextService: AppContextService,
    private pageService: PageService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if the user doesn't have permissions to access this route - send them back to the dashboard
    if (!this.appContextService.hasPermission(next.data.permissions)) {
      this.pageService.setLoading(false);
      const accessDeniedDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Access Denied',
          question: 'You do not have permission to access this page.',
          confirmButtonText: 'Go Back To Dashboard',
          cancelButtonText: 'Got It'
        }
      });
      accessDeniedDialog.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed === true) {
          this.router.navigate(['/']);
        }
      });
      return false;
    }
    return true;
  }
}
