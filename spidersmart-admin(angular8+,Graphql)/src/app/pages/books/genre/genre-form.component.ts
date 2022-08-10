import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, Genre, GenreService, ApiValidator } from '@spidersmart/ng';
import { PageMode, PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-genre-form',
    templateUrl: './genre-form.component.html'
})
export class GenreFormComponent implements OnInit, OnDestroy {

    public genre: Genre = {
        id: null,
        name: '',
        dateFrom: null,
        createGenre: null,

    };

    public form: FormGroup;
    private ngUnsubscribe: Subject<any> = new Subject();
    public backRoute = ['/genre'];
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        private genreService: GenreService,
        private toastService: ToastrService,

    ){
        this.form = this.fb.group({
            name: ['', null, ApiValidator]
        });
    }

    ngOnInit(){
        this.pageService.setTitle('Create Genre');
        this.pageService.setMode(PageMode.CREATE);
        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Genre');
            this.backRoute = ['/genre', this.activatedRoute.snapshot.params.id, 'view'];

            this.genreService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Genre>) => {
                // update data object and form data to response data, then set form as initialized
                this.genre = response.data;
                this.form.patchValue({
                    name: this.genre.name,
                });
            });
        }
    }
    ngOnDestroy(){
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public save = (): void => {
        this.pageService.setLoading(true);
        this.pageService.clearErrors();

        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.genreService.modify : this.genreService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The genre was edited successfully!' : 'The genre was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The genre could not be edited.' : 'The genre could not be created.';
        action(Object.assign({}, this.genre, this.form.value)).pipe(
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
