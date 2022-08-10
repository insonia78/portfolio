import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AsyncValidatorFn, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject as SubjectObservable } from 'rxjs';
import { takeUntil, take, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Center, Subject, GraphQLResponse, CenterService, ApiValidator, Permission, SubjectService } from '@spidersmart/ng';
import { PageMode, TextMask, PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-center-form',
    templateUrl: './center-form.component.html',
    styleUrls: ['./center-form.component.scss']
})
export class CenterFormComponent implements OnInit, OnDestroy {
    public Permission = Permission;
    /** The current center */
    public center: Center = {
        id: null,
        type: 'local',
        name: '',
        label: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        email: '',
        phone: '',
        visible: true,
        useInventory: true,
        bookCheckoutLimit: 1,
        bookCheckoutFrequency: '',
        dateFrom: null,
        hours: null
    };
    /** Reference to text masks for use with  */
    public TextMask = TextMask;
    /** Reference to the form */
    public form: FormGroup;
    /** Available subjects to select from for center subjects */
    public availableSubjects: Subject[] = [];
    /** Default state of the hour of operation open/closed switches */
    public closedDayStates: { [key: string]: boolean } = { 'M': false, 'T': false, 'W': false, 'R': false, 'F': false, 'S': false, 'U': false };
    /** Available frequencies to choose from */
    public availableCheckoutFrequencies = [
        { key: 'WEEKLY', label: 'every week' },
        { key: 'BI_WEEKLY', label: 'every other week' },
        { key: 'SEMI_MONTHLY', label: 'twice a month' },
        { key: 'QUAD_WEEKLY', label: 'every four weeks' },
        { key: 'MONTHLY', label: 'every month' },
        { key: 'BI_MONTHLY', label: 'every other month' },
        { key: 'QUARTERLY', label: 'each quarter' },
    ];
    /** Default return route for cancel action */
    public backRoute = ['/center'];
    /** Subscription to expire subscriptions */
    private ngUnsubscribe: SubjectObservable<any> = new SubjectObservable();

    /**
     * @ignore
     */
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        private centerService: CenterService,
        private subjectService: SubjectService,
        private toastService: ToastrService
    ) {
        // define form structure
        this.form = this.fb.group({
            name: ['', null, ApiValidator],
            label: ['', null, ApiValidator],
            streetAddress: ['', null, ApiValidator],
            city: ['', null, ApiValidator],
            state: ['', null, ApiValidator],
            postalCode: ['', null, ApiValidator],
            country: ['', null, ApiValidator],
            email: ['', null, ApiValidator],
            phone: ['', null, ApiValidator],
            visible: [''],
            useInventory: [''],
            bookCheckoutLimit: [''],
            bookCheckoutFrequency: [''],
            subjects: [null, null, ApiValidator],
            hours: this.fb.group({
                M: this.fb.array([
                    this.fb.group({
                        startTime: [''],
                        endTime: ['']
                    })
                ]),
                T: this.fb.array([
                    this.fb.group({
                        startTime: [''],
                        endTime: ['']
                    })
                ]),
                W: this.fb.array([
                    this.fb.group({
                        startTime: [''],
                        endTime: ['']
                    })
                ]),
                R: this.fb.array([
                    this.fb.group({
                        startTime: [''],
                        endTime: ['']
                    })
                ]),
                F: this.fb.array([
                    this.fb.group({
                        startTime: [''],
                        endTime: ['']
                    })
                ]),
                S: this.fb.array([
                    this.fb.group({
                        startTime: [''],
                        endTime: ['']
                    })
                ]),
                U: this.fb.array([
                    this.fb.group({
                        startTime: [''],
                        endTime: ['']
                    })
                ])
            })
        });
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.pageService.setTitle('Create Center');
        this.pageService.setMode(PageMode.CREATE);

        // register available subjects
        this.subjectService.getAll().pipe(take(1)).subscribe(subjects => {
            this.availableSubjects = subjects.data;
        });

        // if there is an id, then we are in edit mode so there are a few extra tasks to perform
        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Center');
            this.backRoute = ['/center', this.activatedRoute.snapshot.params.id, 'view'];

            this.centerService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Center>) => {
                // update data object and form data to response data, then set form as initialized
                this.center = response.data;
                console.log('CENTER DATA:::', this.center);

                // prepare hours form to match data before patching value
                for (const day of ['M', 'T', 'W', 'R', 'F', 'S', 'U']) {
                    this.closedDayStates[day] = (this.center.hours[day].length > 0);
                    for (let i = 1; i < this.center.hours[day].length; i++) {
                        (this.form.get('hours').get(day) as FormArray).push(this.fb.group({
                            startTime: '',
                            endTime: ''
                        }));
                    }
                }

                this.form.patchValue({
                    name: this.center.name,
                    label: this.center.label,
                    streetAddress: this.center.streetAddress,
                    city: this.center.city,
                    state: this.center.state,
                    postalCode: this.center.postalCode,
                    country: this.center.country,
                    email: this.center.email,
                    phone: this.center.phone,
                    visible: this.center.visible,
                    useInventory: this.center.useInventory,
                    bookCheckoutLimit: this.center.bookCheckoutLimit,
                    bookCheckoutFrequency: this.center.bookCheckoutFrequency,
                    subjects: this.center.subjects,
                    hours: this.center.hours
                });
            });
        }

        // add listener to email field to enforce "spidersmart.com" email addresses
        this.form.get('email').valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val: string) => {
            if (val.indexOf('@') !== -1) {
                const emailParts = val.split('@');
                if (emailParts[1] !== 'spidersmart.com') {
                    this.form.get('email').setValue(emailParts[0] + '@spidersmart.com');
                }
            }
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
     * Returns the hours of operation for the given day
     * @param day The day for which to retrieve current hours of operation
     * @return The current hours for the day
     */
    public getHours(day: string): FormArray {
        return this.form.get('hours').get(day) as FormArray;
    }

    /**
     * Adds a new hour schedule entry for the hours of operations of the given day
     * @param day The day for which a new schedule entry should be added
     */
    public addSchedule(day: string) {
        const schedule = this.fb.group({
            startTime: [''],
            endTime: ['']
        });
        (this.form.get('hours').get(day) as FormArray).push(schedule);
    }

    /**
     * Removes a given schedule entry for the hours of operations
     * @param day The day for which the schedule entry to remove exists
     * @param index The index of the entry to remove
     */
    public removeSchedule(day: string, index: number) {
        (this.form.get('hours').get(day) as FormArray).removeAt(index);
    }

    /**
     * Saves the current form state
     * @return void
     */
    public save = (): void => {
        this.pageService.setLoading(true);
        this.pageService.clearErrors();
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.centerService.modify : this.centerService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The center was edited successfully!' : 'The center was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The center could not be edited.' : 'The center could not be created.';

        // convert hours to proper format for saving
        const saveHours = [];
        ['M', 'T', 'W', 'R', 'F', 'S', 'U'].forEach(day => {
            const schedule = this.form.get('hours').get(day) as FormArray;
            console.log(schedule);
            for (let i = 0; i < schedule.length; i++) {
                const control = schedule.at(i);
                if (control.get('startTime').value !== '' || control.get('endTime').value !== '') {
                    saveHours.push({
                        day: day,
                        startTime: control.get('startTime').value,
                        endTime: control.get('endTime').value
                    });
                }
            }
        });

        action(Object.assign({}, this.center, this.form.value, {
            type: 'local',
            phone: TextMask.phone.unmask(this.form.get('phone').value),
            latitude: '64.54356',
            longitude: '63.55676',
            timezone: 'America/New_York',
            hours: saveHours
        })).pipe(
            take(1),
            catchError((err) => {
                Object.entries(this.form.controls).forEach(([name, control]) => control.updateValueAndValidity());
                this.toastService.error(errorResponse);
                throw errorResponse;
            }),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            this.toastService.success(successResponse);
            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.router.navigate(this.backRoute);
        });
    }

    /**
     * Syncs the label field to match the name field
     * @return void
     */
    public syncLabelToName = (name: string): void => {
        this.form.get('label').setValue(
            name.toLocaleLowerCase().replace(/[ _]/g, '-').replace(/[^a-z0-9-]+/g, '')
        );
    }
}
