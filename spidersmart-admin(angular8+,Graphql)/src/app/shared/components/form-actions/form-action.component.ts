import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sm-form-action',
  template: `
    <button mat-flat-button [ngClass]="type" [disabled]="disabled" (click)="triggerAction(action)"><ng-content></ng-content></button>
  `,
  styles: [`
    button {
      margin: 0 0.5rem;
    }
  `]
})
export class FormActionComponent {
  /** The action which should be performed when the action is triggered.  Supports a function reference or a route. */
  @Input()
  action: Function | any[] = null;

  /** Parameters to pass to triggered action if it is a function. */
  @Input()
  parameters: any[] = [];

  /** The type of button style which should be appliied */
  @Input()
  type: 'primary' | 'secondary' | 'tertiary' = 'primary';

  /** Whether the button is disabled or not */
  @Input()
  disabled = false;

  constructor(
    private router: Router
  ) { }

  /**
   * Triggers the given action or redirects to the given route
   * @param action The action to perform or route to which to direct
   * @param parameters Any number of additional parameters which will be passed into the given function
   * @return void
   */
  public triggerAction(action: Function | any[]): void {
    if (action instanceof Function) {
      action(...this.parameters);
    }
    else {
      this.router.navigate(action);
    }
  }
}
