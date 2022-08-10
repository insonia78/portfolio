import { Component, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { ContactType, ContactTypeDisplay } from '@spidersmart/ng';
import { Subject } from 'rxjs';
import { TextMask } from '@spidersmart/core';
import { takeUntil } from 'rxjs/operators';

/**
 * Interface to define the control value for this input
 */
export interface ContactInputValues {
  id: number;
  type: string;
  title: string;
  value: string;
}

/**
 * Defines a form control to input a new contact
 */
@Component({
  selector: 'sm-contact-input',
  templateUrl: './contact-input.component.html',
  styleUrls: ['./contact-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ContactInputComponent),
      multi: true
    }
  ]
})
export class ContactInputComponent implements ControlValueAccessor {
  /**
   * Internal form group used to track input value
   * @ignore
   */
  public form: FormGroup;
  /**
   * Reference to enum for template
   */
  public ContactType = ContactType;
  /**
   * Reference to enum for template
   */
  public ContactTypeDisplay = ContactTypeDisplay;
  /**
   * Reference to enum for template
   */
  public TextMask = TextMask;
  /**
   * Subscription to expire subscriptions
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * Accessor and mutator for the control value
   */
  get value(): ContactInputValues | null {
    if (this.form && this.form.valid) {
      return this.form.value;
    }
    return null;
  }
  set value(value: ContactInputValues) {
    if (this.form) {
      this.form.patchValue(value);
      this.onChange(value);
      this.onTouch();
    }
  }

  /**
   * Returns the text mask for the value control based on currently selected type value
   * @return TextMask
   */
  get mask() {
    if ([ContactType.HOME_PHONE, ContactType.MOBILE_PHONE, ContactType.WORK_PHONE].includes(this.form.get('type').value)) {
      return TextMask.phone;
    }
    return { mask: false };
  }

  /**
   * @ignore
   */
  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      id: [null],
      type: [ContactType.EMAIL],
      title: ['', Validators.required],
      value: ['', Validators.required]
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
  writeValue(val: ContactInputValues) {
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
