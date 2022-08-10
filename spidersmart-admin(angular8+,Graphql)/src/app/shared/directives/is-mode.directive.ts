import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { PageService, PageMode } from '@spidersmart/core';

/**
 * This directive will confirm that the current page service mode the given mode and will remove the element from the viewport if not
 *
 * @input isMode PageMode|PageMode[] The context required to view the element.  This can either be a single context or a list of contexts.
 * @input negative boolean If true, this will only show the element if NOT IN ANY OF the given context(s)
 *
 * @example <div *isMode="CREATE"></div> - Displays if the page is in CREATE mode
 * @example <div *isMode="[CREATE, EDIT]"></div> - Displays if the the page is in EITHER CREATE or EDIT mode
 * @example <div *isMode="CREATE; negative: true"></div> - Displays if the page is NOT in CREATE mode
 * @example <div *isMode="[CREATE, EDIT]; negative: true"></div> - Displays if the the page is NOT IN ANY OF CREATE or EDIT mode
 */
@Directive({
  selector: '[isMode]'
})
export class IsModeDirective implements OnDestroy {
  /**
   * The subscription to the status of the page mode
   */
  private pageMode: Subscription = new Subscription();

  /** If set to true, the context comparison will be negative, if false, positive */
  private negative: boolean = false;
  @Input()
  set isModeNegative(state: boolean) {
    this.negative = state;
    this.checkPageMode();
  }

  /** The context to compare against, accepts any number of context parameters */
  private modes: PageMode[] = [];
  @Input()
  set isMode(modes: PageMode[]) {
    // ensure modes is an array
    this.modes = (modes instanceof Array) ? <PageMode[]>modes : <PageMode[]>[modes];
    this.checkPageMode();
  }

  /**
   * Creates or updates the page mode check subscription with given data
   */
  private checkPageMode(): void {
    this.pageMode.unsubscribe();
    this.pageMode = this.pageService.getMode().pipe(
      map((currentMode: PageMode) => {
        console.log('IS MODE::', currentMode, this.modes, this.negative);
        return (this.negative) ? !this.modes.includes(currentMode) : this.modes.includes(currentMode);
      })
    ).subscribe((valid: boolean) => {
      this.updateView(valid);
      this.cd.markForCheck();
    });
  }


  /**
   * Updates the viewport depending on the current context
   * @param result The result of the comparison
   * @return void
   */
  private updateView(result: boolean): void {
    if (typeof result === 'undefined' || result == null) {
      return;
    }
    this.viewContainer.clear();

    if (result) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private pageService: PageService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.pageMode.unsubscribe();
  }
}
