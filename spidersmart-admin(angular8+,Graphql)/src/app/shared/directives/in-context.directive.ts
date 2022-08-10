import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AppContextService, Context } from '@spidersmart/core';

/**
 * This directive will confirm that the current app context matches matches the given context and will remove the element from the viewport if not
 *
 * @input inContext Context|Context[] The context required to view the element.  This can either be a single context or a list of contexts.
 * @input negative boolean If true, this will only show the element if NOT IN ANY OF the given context(s)
 *
 * @example <div *inContext="ContextA"></div> - Displays if the app is in ContextA
 * @example <div *inContext="[ContextA, ContextB]"></div> - Displays if the the app is in EITHER ContextA OR ContextB
 * @example <div *inContext="ContextA; negative: true"></div> - Displays if the app is NOT in ContextA
 * @example <div *inContext="[ContextA, ContextB]; negative: true"></div> - Displays if the the app is NOT IN ANY OF ContextA OR ContextB
 */
@Directive({
  selector: '[inContext]'
})
export class InContextDirective implements OnDestroy {
  /** Subject to ensure all subscriptions close when element is destroyed */
  private ngUnsubscribe: Subject<any> = new Subject();

  /** If set to true, the context comparison will be negative, if false, positive */
  private negative: boolean = false;
  @Input()
  set inContextNegative(state: boolean) {
    this.negative = state;
  }

  /** The context to compare against, accepts any number of context parameters */
  @Input()
  set inContext(contexts: Context[]) {
    // ensure permission is an array, so we can run intersect against user permissions
    contexts = (contexts instanceof Array) ? <Context[]>contexts : <Context[]>[contexts];
    this.appContextService.getContext().pipe(
      takeUntil(this.ngUnsubscribe),
      map((currentContext: Context) => {
        // console.log('IN CONTEXT::', currentContext, contexts);
        // return valid based on intersection result and comparison mode
        return (this.negative) ? !contexts.includes(currentContext) : contexts.includes(currentContext);
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
    private appContextService: AppContextService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
