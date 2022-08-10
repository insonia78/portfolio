import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { QuillModule } from 'ngx-quill';
import { TextMaskModule } from 'angular2-text-mask';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from 'ng-click-outside';
import { ChipsModule, PrintModule } from '@spidersmart/ng';
import { SharedModule } from '@spidersmart/shared';
import { routes } from './assignment-submission.routing';
import { AssignmentSubmissionListComponent } from './assignment-submission-list.component';
import { AssignmentSubmissionReviewComponent } from './assignment-submission-review.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    TextMaskModule,
    ChipsModule,
    PrintModule,
    ClickOutsideModule,
    QuillModule.forRoot()
  ],
  declarations: [AssignmentSubmissionListComponent, AssignmentSubmissionReviewComponent],
  exports: [RouterModule]
})
export class AssignmentSubmissionModule { }
