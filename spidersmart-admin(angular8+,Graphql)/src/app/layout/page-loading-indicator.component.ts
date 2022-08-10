import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageService } from '@spidersmart/core';

@Component({
    selector: 'sm-page-loading-indicator',
    template: `
        <div id="pageLoadingIndicator" *ngIf="loading">
           <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>
    `,
    styleUrls: ['./page-loading-indicator.component.scss']
})
export class PageLoadingIndicatorComponent implements OnInit, OnDestroy {
    /** The state of the loading indicator */
    public loading: boolean = false;
    /** used to destroy any subscriptions when component is destroyed */
    protected ngUnsubscribe: Subject<any> = new Subject();

    constructor(private changeDetectorRef: ChangeDetectorRef, private pageService: PageService) {
        this.changeDetectorRef.detach();
    }

    ngOnInit() {
        // set listener for page loading status
        this.pageService.getLoading().pipe(takeUntil(this.ngUnsubscribe)).subscribe(loading => {
            this.loading = loading;
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
