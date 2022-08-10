import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { PrintModule } from '@spidersmart/ng';
import { SharedModule } from '@spidersmart/shared';

import { GlobalSearchComponent } from './global-search/global-search.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { ContentHeaderPageActionComponent } from './content-header/content-header-page-action.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

import { PageLoadingIndicatorComponent } from './page-loading-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatDialogModule,
    RouterModule,
    PrintModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [DatePipe],
  declarations: [GlobalSearchComponent, TopNavComponent, UserMenuComponent, ContentHeaderComponent, ContentHeaderPageActionComponent, PageLoadingIndicatorComponent],
  exports: [GlobalSearchComponent, TopNavComponent, UserMenuComponent, PageLoadingIndicatorComponent, ContentHeaderComponent, ContentHeaderPageActionComponent]
})
export class LayoutModule { }
