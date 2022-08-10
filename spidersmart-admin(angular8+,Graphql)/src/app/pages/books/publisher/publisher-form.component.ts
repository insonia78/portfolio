import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GraphQLResponse, ApiValidator, PublisherService, Publisher } from '@spidersmart/ng';
import { PageMode, PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-publisher-form',
    templateUrl: './publisher-form.component.html'
})
export class PublisherFormComponent implements OnInit, OnDestroy {

    public publisher: Publisher = {
        id: null,
        name: '',
        dateFrom: null,
        createPublisher: null,

    };
    public form: FormGroup;
    private ngUnsubscribe: Subject<any> = new Subject();
    public backRoute = ['/publisher'];
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageService: PageService,
        private publisherService: PublisherService,
        private toastService: ToastrService,

    ){
        this.form = this.fb.group({
            name: ['', null, ApiValidator]
        });
    }

    ngOnInit(){
        this.pageService.setTitle('Create Publisher');
        this.pageService.setMode(PageMode.CREATE);
        if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
            this.pageService.setMode(PageMode.EDIT);
            this.pageService.setTitle('Edit Publisher');
            this.backRoute = ['/publisher', this.activatedRoute.snapshot.params.id, 'view'];

            this.publisherService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((response: GraphQLResponse<Publisher>) => {
                // update data object and form data to response data, then set form as initialized
                this.publisher = response.data;
                this.form.patchValue({
                    name: this.publisher.name,
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

        const action = (this.pageService.isMode(PageMode.EDIT)) ? this.publisherService.modify : this.publisherService.create;
        const successResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The publisher was edited successfully!' : 'The publisher was created successfully!';
        const errorResponse = (this.pageService.isMode(PageMode.EDIT)) ? 'The publisher could not be edited.' : 'The publisher could not be created.';


        action(Object.assign({}, this.publisher, this.form.value)).pipe(
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
