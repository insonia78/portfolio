import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { take, finalize, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Student, GraphQLResponse, StudentService, ApiValidator, ApiValidatorClear } from '@spidersmart/ng';
import { PageMode, PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-student-form',
    templateUrl: './student-form.component.html',
    styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
    /** The current student */
    public student: Student = {
        id: null,
        username: '',
        password: '',
        email: '',
        prefix: '',
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        gender: 'M',
        school: '',
        dateOfBirth: null,
        theme: '',
        active: true,
        verified: false,
        enrollments: [],
        contacts: [],
        addresses: [],
        dateFrom: null
    };
    public form: FormGroup;
    public backRoute = ['/student'];

    /** Object to hold gender options */
    public genders = [
        {
            label: 'Male',
            value: 'M'
        },
        {
            label: 'Female',
            value: 'F'
        }
    ];

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
        private studentService: StudentService,
        private toastService: ToastrService
    ) {
        // define form structure
        this.form = this.fb.group({
            username: ['', Validators.pattern("^[a-zA-Z0-9-_.]+$"), ApiValidator],
            password: ['', null, ApiValidator],
            email: ['', null, ApiValidator],
            prefix: ['', null, ApiValidator],
            firstName: ['', null, ApiValidator],
            middleName: ['', null, ApiValidator],
            lastName: ['', null, ApiValidator],
            suffix: ['', null, ApiValidator],
            gender: ['', null, ApiValidator],
            school: ['', null, ApiValidator],
            dateOfBirth: ['', null, ApiValidator],
            contacts: this.fb.array([]),
            enrollments: this.fb.array([]),
            addresses: this.fb.array([])
        });
    }

    /**
     * @ignore
     */
    ngOnInit() {
        this.pageService.setTitle('Create Student');
        this.pageService.setMode(PageMode.CREATE);

        // if there is an id, then we are in edit mode so there are a few extra tasks to perform
        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Student');
            this.backRoute = ['/student', this.activatedRoute.snapshot.params.id, 'view'];
            this.pageService.setLoading(true);

            this.studentService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Student>) => {
                this.student = response.data;

                // patch the form with current values
                this.form.patchValue({
                    username: this.student.username,
                    email: this.student.email,
                    prefix: this.student.prefix,
                    firstName: this.student.firstName,
                    middleName: this.student.middleName,
                    lastName: this.student.lastName,
                    suffix: this.student.suffix,
                    gender: this.student.gender,
                    school: this.student.school,
                    dateOfBirth: new Date(this.student.dateOfBirth)
                });

                // add contacts, enrollments, and addresses
                this.student.contacts.forEach(contact => {
                    (this.form.get('contacts') as FormArray).push(this.fb.control({
                        id: contact.id,
                        type: contact.type,
                        title: contact.title,
                        value: contact.value
                    }));
                });
                this.student.enrollments.forEach(enrollment => {
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
                this.student.addresses.forEach(address => {
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

                this.pageService.setLoading(false);
            });
        } else {
            // if not edit mode, set defaults for contacts, enrollments, and addresses
            this.addContact();
            this.addAddress();
            this.addEnrollment();
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
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.studentService.modify : this.studentService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The student was edited successfully!' : 'The student was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The student could not be edited.' : 'The student could not be created.';

        action(Object.assign({}, this.student, this.form.value)).pipe(
            take(1),
            catchError((err) => {
                Object.entries(this.form.controls).forEach(([name, control]) => {
                    control.updateValueAndValidity();
                    control.valueChanges.pipe(take(1)).subscribe(value => {
                        ApiValidatorClear();
                        control.updateValueAndValidity();
                    })
                });                
                this.toastService.error(errorResponse);
                throw errorResponse;
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
