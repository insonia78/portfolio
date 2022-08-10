import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, Author, AuthorService, ApiValidator } from '@spidersmart/ng';
import { PageMode, PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-author-form',
    templateUrl: './author-form.component.html'
})
export class AuthorFormComponent implements OnInit {
    /**
     * Stores loaded author data
     */
    public author: Author = {
        id: null,
        name: '',
        dateFrom: null
    };
    /**
     * Author form group
     */
    public form: FormGroup;
    /**
     * The default route back to the previous page
     */
    public backRoute = ['/authors'];
    
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        private authorService: AuthorService,
        private toastService: ToastrService,
    ){
        this.form = this.fb.group({
            name: ['', null, ApiValidator]
        });
    }

    ngOnInit(){
        this.pageService.setTitle('Create Author');
        this.pageService.setMode(PageMode.CREATE);
        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Author');
            this.backRoute = ['/authors', this.activatedRoute.snapshot.params.id, 'view'];

            this.authorService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Author>) => {
                // update data object and form data to response data, then set form as initialized
                this.author = response.data;
                this.form.patchValue({
                    name: this.author.name,
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
        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.authorService.modify : this.authorService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The author was edited successfully!' : 'The author was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The author could not be edited.' : 'The author could not be created.';

        action(Object.assign({}, this.author, this.form.value)).pipe(
            take(1),
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
            else{
                this.toastService.error(errorResponse);
            }
        });
    }
}
