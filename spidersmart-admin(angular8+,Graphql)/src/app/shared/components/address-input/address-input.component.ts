import { Component, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Interface to define the control value for this input
 */
export interface AddressInputValues {
  id: number;
  title: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Defines a form control to input a new contact
 */
@Component({
  selector: 'sm-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor {
  /**
   * Internal form group used to track input value
   * @ignore
   */
  public form: FormGroup;
  /**
   * Subscription to expire subscriptions
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * Accessor and mutator for the control value
   */
  get value(): AddressInputValues | null {
    if (this.form && this.form.valid) {
      return this.form.value;
    }
    return null;
  }
  set value(value: AddressInputValues) {
    if (this.form) {
      this.form.patchValue(value);
      this.onChange(value);
      this.onTouch();
    }
  }

  /**
   * @ignore
   */
  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.onChange(value);
      this.onTouch();
    });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * @ignore
   */
  onTouch: any = () => { };

  /**
   * @ignore
   */
  onChange: any = () => { };

  /**
   * @ignore
   */
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * @ignore
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * @ignore
   */
  writeValue(val: AddressInputValues) {
    if (val) {
      this.value = val;
    }
    if (val === null) {
      this.form.reset();
    }
  }

  /**
   * @ignore
   */
  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false } };
  }
}
