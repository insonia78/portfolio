import { Component, ElementRef, NgZone, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'sm-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.scss']
})
export class FormActionsComponent implements AfterViewInit, OnDestroy {
  // 1. rename to StickyPanelComponent
  // 2. get rid of "sm-form-action" component (it essentially is just a wrapper for mat-button, so the panel can just contain
  //    mat-button directly (like in student cp) - this will allow for more flexibility too and the only downside is we can't change
  //    button styles across all instances of the panel in one go)
  // 3. migrate the new sticky panel component to @spidersmart/ng
  // 4. update student cp and admin cp to use it in place of form-action component (admin cp) or just the html/css (student cp)
  /**
   * If the panel is currently in a "stuck" state
   */
  private isStuck = false;

  /**
   * The height of the panel
   */
  private height: number = null;

  /**
   * Observer to watch panel viewport intersection status so sticky status can be derived
   */
  private observer: IntersectionObserver | null = null;

  /**
   * Accessor to get the offset which the marker should use
   */
  get markerOffset(): string {
    return (this.height) ? this.position + ': ' + (-(this.height) - 11) + 'px' : null;
  }

  /**
   * Whether panel should stick to the top or bottom of the screen
   */
  @Input() position: 'top' | 'bottom' = 'bottom';

  /**
   * Reference to the marker element - used to determine if panel is stuck
   */
  @ViewChild('marker') marker: ElementRef<any>;

  /**
   * Reference to the wrapping element
   */
  @ViewChild('wrapper') wrapper: ElementRef<any>;

  /**
   * @ignore
   */
  constructor(
    private elementRef: ElementRef,
    private zone: NgZone
  ) { }

  /**
   * @ignore
   */
  ngAfterViewInit(): void {
    // set the height and position of the component
    this.height = this.wrapper.nativeElement.offsetHeight;
    this.elementRef.nativeElement.classList.add(this.position);

    // if the browser doesn't support position: sticky or intersection observer, stop trying to do this
    if (!CSS.supports || !CSS.supports('position', 'sticky') || !IntersectionObserver) {
      return;
    }

    // start watching for changes in DOM-state without impacting Angular change detection
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(this.handleIntersection);
      this.observer.observe(this.marker.nativeElement);
    });
  }

  /**
   * @ignore
   */
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Handles updating the element class based on sticky status
   */
  private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    console.log('here', entries);
    for (const entry of entries) {
      if (entry.target === this.marker.nativeElement) {
        // intersecting represents the marker being visible, therefore meaning the actions are UNSTUCK
        // so, if the stuck status IS THE SAME as the intersecting, this means it has changed (since they represent inverse things)
        if (this.isStuck === entry.isIntersecting) {
          this.isStuck = !entry.isIntersecting;
          this.zone.run(() => {
            (this.isStuck) ? this.elementRef.nativeElement.classList.add('stuck') : this.elementRef.nativeElement.classList.remove('stuck');
          });

        }
      }
    }
  }
}
