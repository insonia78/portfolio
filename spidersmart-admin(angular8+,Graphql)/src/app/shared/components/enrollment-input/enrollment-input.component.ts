import { Component, forwardRef, ChangeDetectionStrategy, OnInit, OnDestroy, Input, ChangeDetectorRef, ɵConsole, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { Subject as SubjectObservable, BehaviorSubject, combineLatest } from 'rxjs';
import { Level, CenterService, Center, Subject, SubjectService } from '@spidersmart/ng';
import { AppContextService, AppContextCenter } from '@spidersmart/core';
import { takeUntil, take, mergeMap, map, toArray } from 'rxjs/operators';

/**
 * Interface to define the control value for this input
 */
export interface EnrollmentInputValues {
  id: number;
  center: Center;
  level: Level;
}

/**
 * Defines a form control to input a new contact
 */
@Component({
  selector: 'sm-enrollment-input',
  templateUrl: './enrollment-input.component.html',
  styleUrls: ['./enrollment-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnrollmentInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EnrollmentInputComponent),
      multi: true
    }
  ]
})
export class EnrollmentInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * Internal form group used to track input value
   * @ignore
   */
  public form: FormGroup;
  
  /**
   * Holds the available centers for the enrollment
   */
  public availableCenters: AppContextCenter[] = [];

  public availableSubjects: Subject[] = [];

  /**
   * Utilty getter to access levels based on selected subject
   */
  public get availableLevels(): Level[] {
    if (this.form.get('subject').value) {
      // get the list of available levels by cross-referencing the chosen level with the chosen center
      const subject = this.availableSubjects.find(sbj => sbj.id === this.form.get('subject').value.id);
      if (subject && subject.levels) {
        return subject.levels;
      }
    }
    return  [];
  }
  
  /**
   * Subscription to expire subscriptions
   */
  private ngUnsubscribe: SubjectObservable<any> = new SubjectObservable();

  /**
   * Accessor and mutator for the control value
   */
  get value(): EnrollmentInputValues | null {
    if (this.form && this.form.valid) {
      return this.form.value;
    }
    return null;
  }
  set value(value: EnrollmentInputValues) {
    if (this.form && value) {
      this.form.patchValue({
        center: (value.center) ? value.center : null,
        subject: (value.level && value.level.subject) ? value.level.subject : null,
        level: (value.level) ? value.level : null
      });
      this.onChange(this.formatResponse());
      this.onTouch();
    }
  }

  /**
   * Whether to show subjects dropdown
   */
  @Input() showSubjects = true;

  /**
   * Whether to show levels dropdown, only applies if showSubjects is true
   */
  @Input() showLevels = true;

  /**
   * Whether to show the remove icon
   */
  @Input() showRemoveIcon = true;

  /**
   * Triggers when the remove icon is clicked
   */
  @Output() remove = new EventEmitter<null>();

  /**
   * @ignore
   */
  constructor(
    private fb: FormBuilder,
    private appContextService: AppContextService,
    private subjectService: SubjectService,
    private cdRef: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      id: [null],
      center: [null, Validators.required],
      subject: [null, Validators.required],
      level: [null, Validators.required]
    });

    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.onChange(this.formatResponse());
      this.onTouch();
    });
  }

  /**
   * @ignore
   */
  ngOnInit() {
    combineLatest([
      this.subjectService.getAll(),
      this.appContextService.getAccessibleCenters()
    ]).pipe(
        take(1)
    ).subscribe(([subjects, accessibleCenters]) => {
      this.availableSubjects = subjects.data;
      this.availableCenters = accessibleCenters;

      // make sure that the currently selected center is in the available centers for this user - otherwise field should be disabled
      if (this.form.get('center').value) {
        const center = this.availableCenters.find(ctr => Number(ctr.id) === Number(this.form.get('center').value.id));
        if (!center) {
          this.form.disable();
        }
      }

      this.form.get('center').valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((center: Center) => {
        this.form.get('subject').setValue(null);

        // update disabled status based on new center value
        const centerRef = this.availableCenters.find(ctr => Number(ctr.id) === Number(center.id));
        if (!centerRef) {
          this.form.disable();
        } else if (this.form.disabled) {
          this.form.enable();
        }
      });
      this.form.get('subject').valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((subject: Subject) => {
        if (this.showLevels) {
          this.form.get('level').setValue(null);
        }
      });
      this.cdRef.detectChanges();
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
  writeValue(val: EnrollmentInputValues) {
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

  /**
   * Comparison method to compare the given two objects for equivalency
   * @param first The first object to compare
   * @param second The second object to compare
   * @return Whether the two objects are equivalent
   */
  public compareWith(first: any, second: any): boolean {    
    return (first && second && Number(first.id) === Number(second.id));
  }

  /**
   * Formats the response to be issued back to the encompassing form
   * @return The formatted response to be issued
   */
  private formatResponse() {
    const center = (this.form.get('center').value && this.form.get('center').value.id) ? { id: this.form.get('center').value.id, name: this.form.get('center').value.name} : null;
    const level = (this.form.get('level').value && this.form.get('level').value.id) ? { id: this.form.get('level').value.id, name: this.form.get('level').value.name } : null;
    return  {
      center: center,
      level: level
    };
  }
}
