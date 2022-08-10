import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { AutocompleteModule } from '@spidersmart/ng';
import { SharedModule } from '@spidersmart/shared';

import { routes } from './approved-book.routing';
import { ApprovedBookListComponent } from './approved-book-list.component';
import { ApprovedBookViewComponent } from './approved-book-view.component';
import { ApprovedBookFormComponent } from './approved-book-form.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatChipsModule,
    MatTooltipModule,
    AutocompleteModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ApprovedBookListComponent, ApprovedBookViewComponent, ApprovedBookFormComponent],
  exports: [RouterModule]
})
export class ApprovedBookModule { }
