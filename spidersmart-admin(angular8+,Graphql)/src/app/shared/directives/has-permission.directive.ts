import { Directive, Input, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Permission } from '@spidersmart/ng';
import { AppContextService } from '@spidersmart/core';

/**
 * This directive will confirm that the logged in user has the given permissions to view the element and will remove it from the viewport if not
 *
 * @input hasPermission Permission|Permission[] The permissions required to view the element.  This can either be a single permission or a list of permissions.
 * @input matchAll boolean Whether to use match all mode.  If true, all defined permissions must belong to the user, otherwise, the element will display if any permission belongs to the user.
 * @input else templateRef The template which should be used in an else condition
 *
 * @example <div *hasPermission="MyPermission"></div> - Displays is MyPermission exists in the user permissions
 * @example <div *hasPermission="[MyPermission1, MyPermission2, MyPermission3]"></div> - Displays if the user has EITHER MyPermission1, MyPermission2, OR MyPermission3
 * @example <div *hasPermission="[MyPermission1, MyPermission2, MyPermission3]; matchAll: true"></div> - Displays if the user has ALL OF MyPermission1, MyPermission2, AND MyPermission3
 */
@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective<T = any> {
  /**
   *  The reference to the "then" and "else" templates and views
   */
  private elseTemplate: TemplateRef<T>|null = null;

  /**
   * The permissions set as needed
   */
  private permissions: Permission[] = [];

  /**
   * The current valid state of the permission
   */
  private _isValid = false;
  private get isValid(): boolean {
    return this.appContextService.hasPermission(this.permissions, (this.matchAll ? 'all' : 'any'));
  }

  /**
   * The permissions to compare against, accepts any number of permission parameters 
   */
  @Input()
  set hasPermission(permissions: Permission[]) {
    this.permissions = permissions;
    this.updateView();
    // this.cd.markForCheck();
  }


  /**
   * If set to true, the permission comparison approach will be MATCH_ALL, if false, MATCH_ANY 
   */
  private matchAll: boolean = false;
  @Input()
  set hasPermissionMatchAll(state: boolean) {
    this.matchAll = state;
    this.updateView();
  }

  /**
   * Sets the else condition for the permission template
   */
  @Input()
  set hasPermissionElse(templateRef: TemplateRef<any>|null) {
    this.elseTemplate = templateRef;
    this.updateView();
  }

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cd: ChangeDetectorRef
  ) { }

  /**
   * Updates the viewport depending on the permissions validation comparison
   * @param result The result of the comparison
   * @return void
   */
  private updateView(): void {
    const result = this.isValid;
    if (typeof result === 'undefined' || result == null) {
      return;
    }
    this.viewContainer.clear();

    if (result) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.elseTemplate !== null) {
      this.viewContainer.createEmbeddedView(this.elseTemplate);
    }
  }
}
