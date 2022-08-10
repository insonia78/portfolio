import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { throwError } from 'rxjs';
import { take, finalize, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Teacher, TeacherService, GraphQLResponse, ApiValidator } from '@spidersmart/ng';
import { PageMode, PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-teacher-form',
    templateUrl: './teacher-form.component.html',
    styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {
    /** The current teacher */
    public teacher: Teacher = {
        id: null,
        username: '',
        password: '',
        email: '',
        prefix: '',
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        active: true,
        verified: false,
        enrollments: [],
        contacts: [],
        addresses: [],
        dateFrom: null
    };
    public form: FormGroup;
    public backRoute = ['/teacher'];

    /** If we are showing the password in plain text */
    public showPassword: boolean = false;

    /**
     * Returns the array of contacts
     * @return FormArray
     */
    get formContacts() {
        return this.form.get('contacts') as FormArray;
    }

    /**
     * Returns the array of enrollments
     * @return FormArray
     */
    get formEnrollments() {
        return this.form.get('enrollments') as FormArray;
    }

    /**
     * Returns the array of addresses
     * @return FormArray
     */
    get formAddresses() {
        return this.form.get('addresses') as FormArray;
    }

    /**
     * @ignore
     */
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public pageService: PageService,
        private teacherService: TeacherService,
        private toastService: ToastrService
    ) {
        // define form structure
        this.form = this.fb.group({
            username: ['', null, ApiValidator],
            email: ['', null, ApiValidator],
            password: ['', null, ApiValidator],
            prefix: ['', null, ApiValidator],
            firstName: ['', null, ApiValidator],
            middleName: ['', null, ApiValidator],
            lastName: ['', null, ApiValidator],
            suffix: ['', null, ApiValidator],
            contacts: this.fb.array([]),
            enrollments: this.fb.array([]),
            addresses: this.fb.array([])
        });
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.pageService.setTitle('Create Teacher');
        this.pageService.setMode(PageMode.CREATE);

        // if there is an id, then we are in edit mode so there are a few extra tasks to perform
        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Teacher');
            this.backRoute = ['/teacher', this.activatedRoute.snapshot.params.id, 'view'];

            this.teacherService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Teacher>) => {
                this.teacher = response.data;

                // patch the form with current values
                this.form.patchValue({
                    username: this.teacher.username,
                    email: this.teacher.email,
                    prefix: this.teacher.prefix,
                    firstName: this.teacher.firstName,
                    middleName: this.teacher.middleName,
                    lastName: this.teacher.lastName,
                    suffix: this.teacher.suffix
                });

                // add contacts, enrollments, and addresses
                this.teacher.contacts.forEach(contact => {
                    (this.form.get('contacts') as FormArray).push(this.fb.control({
                        id: contact.id,
                        type: contact.type,
                        title: contact.title,
                        value: contact.value
                    }));
                });
                this.teacher.enrollments.forEach(enrollment => {
                    (this.form.get('enrollments') as FormArray).push(this.fb.control({
                        id: enrollment.id,
                        center: {
                            id: enrollment.center.id,
                            name: enrollment.center.name,
                            label: enrollment.center.label
                        },
                        level: enrollment.level
                    }));
                });
                this.teacher.addresses.forEach(address => {
                    (this.form.get('addresses') as FormArray).push(this.fb.control({
                        id: address.id,
                        title: address.title,
                        streetAddress: address.streetAddress,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country
                    }));
                });
            });
        }
    }

    /**
     * Adds a new contact to the form
     */
    public addContact() {
        (this.form.get('contacts') as FormArray).push(this.fb.control({
            type: 'mobile_phone',
            title: '',
            value: ''
        }));
    }

    /**
     * Removes a contact at the given index
     * @param index The index at which the contact should be removed
     */
    public removeContact(index: number) {
        (this.form.get('contacts') as FormArray).removeAt(index);
    }

    /**
     * Adds a new enrollment to the form
     */
    public addEnrollment() {
        (this.form.get('enrollments') as FormArray).push(this.fb.control({
            center: '',
            level: ''
        }));
    }

    /**
     * Removes a enrollment at the given index
     * @param index The index at which the enrollment should be removed
     */
    public removeEnrollment(index: number) {
        (this.form.get('enrollments') as FormArray).removeAt(index);
    }

    /**
     * Adds a new address to the form
     */
    public addAddress() {
        (this.form.get('addresses') as FormArray).push(this.fb.control({
            title: '',
            streetAddress: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }));
    }

    /**
     * Removes an address at the given index
     * @param index The index at which the address should be removed
     */
    public removeAddress(index: number) {
        (this.form.get('addresses') as FormArray).removeAt(index);
    }

    /**
     * Saves the current form state
     * @return void
     */
    public save = (): void => {
        this.pageService.setLoading(true);
        this.pageService.clearErrors();
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.teacherService.modify : this.teacherService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The teacher was edited successfully!' : 'The teacher was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The teacher could not be edited.' : 'The teacher could not be created.';

        action(Object.assign({}, this.teacher, this.form.value)).pipe(
            take(1),
            catchError((err) => {
                Object.entries(this.form.controls).forEach(([name, control]) => control.updateValueAndValidity());
                this.toastService.error(errorResponse);
                return throwError(errorResponse);
            }),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            if (response.success) {
                this.toastService.success(successResponse);
                this.form.markAsPristine();
                this.form.markAsUntouched();
                this.router.navigate(this.backRoute);
            }
        });
    }
}
