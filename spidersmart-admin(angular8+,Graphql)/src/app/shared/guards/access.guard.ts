import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Permission, AlertDialogComponent } from '@spidersmart/ng';
import { AppContextService, PageService } from '@spidersmart/core';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate, CanLoad {
  public constructor(
    private appContextService: AppContextService,
    private pageService: PageService,
    private dialog: MatDialog
  ) {}

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if the user doesn't have permissions to access this application - send them to the login page
    if (!this.appContextService.hasPermission(Permission.ADMINCP_ACCESS) && this.appContextService.getContextLoadResponse() !== 401) {
      this.pageService.setLoading(false);
      const accessDeniedDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Access Denied',
          alert: (this.isContextLoadError()) ?
            'Your account details could not be retrieved.  Please log in again.' :
            'You do not have permission to access this application.',
          buttonText: (this.isContextLoadError()) ?
            'Login Again' :
            'Login As A Different User'
        }
      });
      accessDeniedDialog.afterClosed().subscribe((confirmed: boolean) => {
        window.location.href = this.appContextService.getEnvironmentVariable('authUrl');
      });
      return false;
    }
    return true;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    // if the user doesn't have permissions to access this application - send them to the login page
    if (!this.appContextService.hasPermission(Permission.ADMINCP_ACCESS) && this.appContextService.getContextLoadResponse() !== 401) {
      this.pageService.setLoading(false);
      const accessDeniedDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Access Denied',
          alert: (this.isContextLoadError()) ?
            'Your account details could not be retrieved.  Please log in again.' :
            'You do not have permission to access this application.',
          buttonText: (this.isContextLoadError()) ?
            'Login Again' :
            'Login As A Different User'
        }
      });
      accessDeniedDialog.afterClosed().subscribe((confirmed: boolean) => {
        window.location.href = this.appContextService.getEnvironmentVariable('authUrl');
      });
      return false;
    }
    return true;
  }

  /**
   * Determines whether there was a load error presented when trying to load the user context during initilization
   */
  private isContextLoadError(): boolean {
    const contextLoadResponse = this.appContextService.getContextLoadResponse();
    console.log(contextLoadResponse);
    // don't return context load error for 401 since interpreter will also catch this and return a more appropriate error
    return (contextLoadResponse !== 200 && contextLoadResponse !== 401);
  }
}
