import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { TextMaskModule } from 'angular2-text-mask';
import { AutocompleteModule, CountrySelectModule } from '@spidersmart/ng';
import { SharedModule } from '@spidersmart/shared/shared.module';
import { routes } from './center.routing';
import { CenterListComponent } from './center-list.component';
import { CenterViewComponent } from './center-view.component';
import { CenterFormComponent } from './center-form.component';
import { CenterInventoryComponent } from './center-inventory.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    GoogleMapsModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatListModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    FormsModule,
    TextMaskModule,
    AutocompleteModule,
    CountrySelectModule,
  ],
  declarations: [CenterListComponent, CenterViewComponent, CenterFormComponent, CenterInventoryComponent],
  exports: [RouterModule]
})
export class CenterModule { }
