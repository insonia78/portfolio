import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Permission } from '@spidersmart/ng';

import { AppContextCenter } from '../interfaces/app-context-center.interface';
import { Context } from '../enums/context.enum';
import { Page } from '../interfaces/page.interface';
import { environment } from 'src/environments/environment';

/**
 * Provides access to retrieve and manipulate details about the application status and context
 */
@Injectable({
  providedIn: 'root'
})
export class AppContextService {
  /** The environment variables */
  private environmentVariables: any = null;

  /** The response status from loading context request */
  private contextLoadResponse: number = null;

  /** The current context */
  private context = new BehaviorSubject<Context>(null);

  /** The currently selected center */
  private center = new BehaviorSubject<AppContextCenter>(null);

  /** The list of centers available to be selected */
  private accessibleCenters = new BehaviorSubject<AppContextCenter[]>([]);

  /** The current logged in user id */
  private userId = new BehaviorSubject<number>(null);

  /** If the current user is impersonated */
  private isImpersonating = new BehaviorSubject<boolean>(false);

  /** The list of permissions of the currently logged in user */
  private permissions = new BehaviorSubject<Permission[]>([]);

  /** The history of navigation in this session */
  private navigationHistory = new BehaviorSubject<Page[]>([]);

  /** The route which is currently active */
  private currentRoute = new BehaviorSubject<any[]>(null);

  /**
   * Get the environment variable with the given key
   * @param key The key for the environment variable to return
   * @return The value of the environment variable
   */
  public getEnvironmentVariable(key: string): any {
    return (this.environmentVariables && this.environmentVariables.hasOwnProperty(key)) ? this.environmentVariables[key] : null;
  }

  /**
   * Set the current environment variables
   * @param environmentVariables The variables to set
   */
  public setEnvironmentVariables(environmentVariables: any): void {
    console.log('SET ENV VARS:::', environmentVariables);
    this.environmentVariables = environmentVariables;
  }

  /**
   * Get the load status of the user context
   * @return Whether the user context load had an error
   */
  public getContextLoadResponse(): number {
    return this.contextLoadResponse;
  }

  /**
   * Set the load status of the user context
   * @param loadError If there was an error loading user context
   */
  public setContextLoadResponse(status: number): void {
    this.contextLoadResponse = status;
  }

  /**
   * Get the current context
   * @return Observable of the context
   */
  public getContext(): Observable<Context> {
    return this.context;
  }

  /**
   * Set the current context
   * @param context The context to set
   */
  public setContext(context: Context): void {
    this.context.next(context);
  }

  /**
   * Get the currently selected center
   * @return Observable of the center
   */
  public getCenter(): Observable<AppContextCenter> {
    return this.center;
  }

  /**
   * Set the current center
   * @param center The center to set
   */
  public setCenter(center: AppContextCenter): void {
      this.center.next(center);
  }

  /**
   * Get the list of accessible centers
   * @return Observable of accessible centers
   */
  public getAccessibleCenters(): Observable<AppContextCenter[]> {
    return this.accessibleCenters;
  }

  /**
   * Set the list of accessible centers
   * @param centers The list of centers
   */
  public setAccessibleCenters(centers: AppContextCenter[]): void {
    this.accessibleCenters.next(centers);
  }

  /**
   * Add a center to the list of accessible centers
   * @param center The center to add
   */
  public addAccessibleCenter(center: AppContextCenter): void {
    this.accessibleCenters.pipe(take(1)).subscribe(centers => {
      if (!centers.includes(center)) {
        center.id = Number(center.id);
        centers.push(center);
        this.accessibleCenters.next(centers);
      }
    });
  }

  /**
   * Remove a center from the list of accessible centers
   * @param center The center to remove
   */
  public removeAccessibleCenter(center: AppContextCenter): void {
    this.accessibleCenters.pipe(take(1)).subscribe(centers => {
      const index = centers.findIndex(ctr => ctr.id === center.id);
      if (index !== -1) {
        centers.splice(index, 1);
          this.accessibleCenters.next(centers);
      }
    });
  }

  /**
   * Get the id of the current user
   * @return Observable of the list of the id
   */
  public getUserId(): Observable<number> {
    return this.userId;
  }

  /**
   * Set the user id of the current user
   * @param id The id to set
   */
  public setUserId(id: number): void {
    this.userId.next(id);
  }

  /**
   * If the current user is impersonated
   * @return Whether the current user is impersonated
   */
  public isUserImpersonated(): Observable<boolean> {
    return this.isImpersonating;
  }

  /**
   * Set the user id of the true user when the current user is impersonated
   * @param impersonating If the current user is impersonated
   */
  public setUserImpersonated(impersonating: boolean): void {
    this.isImpersonating.next(impersonating);
  }

  /**
   * Get the list of permissions of the current user
   * @return Observable of the list of permissions
   */
  public getPermissions(): Observable<Permission[]> {
    return this.permissions;
  }

  /**
   * Determine whether the current user has the given permission(s)
   * @param permissions The permission(s) which should be checked for
   * @param compareStrategy The strategy to compare.  If `any`, then this will return true if the current user has any of the given permissions.  If `all`, the user must have all of the given permissions.
   * @return Whether the current user has given permission(s)
   */
  public hasPermission(permissions: Permission | Permission[], compareStrategy: 'any' | 'all' = 'any'): boolean {
    // ensure that given permissions are in the correct format
    permissions = (permissions instanceof Array) ? permissions : [permissions];

    // if given permissions are empty, assume the user has permission
    if (permissions.length < 1) {
      return true;
    }

    // get unique intersection of permissions with user permissions
    const intersections = permissions
      .filter(permission => (this.permissions.getValue().indexOf(permission) > -1))
      .filter((e, i, c) => (c.indexOf(e) === i));

    return (compareStrategy === 'all') ? (intersections.length === this.permissions.getValue().length) : (intersections.length > 0);
  }

  /**
   * Set the list of permissions of the current user
   * @param permissions The list of permissions
   */
  public setPermissions(permissions: Permission[]): void {
    this.permissions.next(permissions);
  }

  /**
   * Add a permission to the current list of permissions
   * @param permission The permission to add
   */
  public addPermission(permission: Permission): void {
    this.permissions.pipe(take(1)).subscribe(permissions => {
      if (!permissions.includes(permission)) {
          permissions.push(permission);
          this.permissions.next(permissions);
      }
    });
  }

  /**
   * Remove a permission from the current list of permissions
   * @param permission The permission to remove
   */
  public removePermission(permission: Permission): void {
    this.permissions.pipe(take(1)).subscribe(permissions => {
      const index = permissions.findIndex(perm => perm === permission);
      if (index !== -1) {
        permissions.splice(index, 1);
          this.permissions.next(permissions);
      }
    });
  }

  /**
   * Get navigation history
   * @return Observable of the list of pages visited in the current session
   */
  public getNavigationHistory(): Observable<Page[]> {
    return this.navigationHistory;
  }

  /**
   * Add page to navigation history
   * @param page The new page to add to the history
   */
  public addPageToNavigationHistory(page: Page): void {
    this.navigationHistory.pipe(take(1)).subscribe(history => {
      if (history[history.length - 1] !== page) {
        history.push(page);
        this.navigationHistory.next(history);
      }
    });
  }

  /**
   * Clears navigation history
   */
  public clearNavigationHistory(): void {
    this.navigationHistory.next([]);
  }

  /**
   * Get the current route
   * @return Observable of the current route
   */
  public getCurrentRoute(): Observable<any[]> {
    return this.currentRoute;
  }

  /**
   * Sets the currently active route
   * @param route The current route
   */
  public setCurrentRoute(route: any[]): void {
    this.currentRoute.next(route);
  }

  /**
   * Moves current route into navigation history with given title
   * @param title The title to store the route with in history
   */
  public storeCurrentRouteInNavigationHistory(title: string = ''): void {
    const currentRoute = this.currentRoute.getValue();
    if (currentRoute) {
      this.addPageToNavigationHistory(<Page>{
        route: currentRoute,
        title: title
      });
    }
  }

  /**
   * Utility method to print out current applicaiton context to the console
   */
  public printAppContext() {
    console.log('CURRENT APP CONTEXT:::', {
      userId: this.userId.getValue(),
      isImpersonating: this.isImpersonating.getValue(),
      context: this.context.getValue(),
      center: this.center.getValue(),
      accessibleCenters: this.accessibleCenters.getValue(),
      permissions: this.permissions.getValue(),
      navigationHistory: this.navigationHistory.getValue()
    });
  }
}
