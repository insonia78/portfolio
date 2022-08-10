import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, Subject, SubjectService, ApiValidator } from '@spidersmart/ng';
import { PageMode, PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-subject-form',
    templateUrl: './subject-form.component.html'
})
export class SubjectFormComponent implements OnInit {
    /**
     * Stores loaded subject data
     */
    public subject: Subject = {
        id: null,
        name: '',
        displayName: null,
        displayIcon: null,
        description: '',
        hasBooks: false,
        hasArticles: false,
        dateFrom: null
    };
    /**
     * Subject form group
     */
    public form: FormGroup;
    /**
     * The default route back to the previous page
     */
    public backRoute = ['/subject'];

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        private subjectService: SubjectService,
        private toastService: ToastrService,
    ){
        this.form = this.fb.group({
            name: ['', null, ApiValidator],
            description: ['', null, ApiValidator]
        });
    }

    ngOnInit(){
        this.pageService.setTitle('Create Subject');
        this.pageService.setMode(PageMode.CREATE);
        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Subject');
            this.backRoute = ['/subject', this.activatedRoute.snapshot.params.id, 'view'];

            this.subjectService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Subject>) => {
                // update data object and form data to response data, then set form as initialized
                this.subject = response.data;
                this.form.patchValue({
                    name: this.subject.name,
                    description: this.subject.description
                });
            });
        }
    }

    /**
     * Saves the form data
     */
    public save = (): void => {
        this.pageService.setLoading(true);
        this.pageService.clearErrors();
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.subjectService.modify : this.subjectService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The subject was edited successfully!' : 'The subject was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The subject could not be edited.' : 'The subject could not be created.';

        action(Object.assign({}, this.subject, this.form.value)).pipe(
            take(1),
            finalize(() => {
                this.pageService.setLoading(false);
            })
        ).subscribe(response => {
            console.log(response);
            if (response.success) {
                this.toastService.success(successResponse);
                this.form.markAsPristine();
                this.form.markAsUntouched();
                this.router.navigate(this.backRoute);
            }
            else{
                this.toastService.error(errorResponse);
            }
        });
    }
}
