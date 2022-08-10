import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { TextMaskModule } from 'angular2-text-mask';
import { PrintModule, ChipsModule } from '@spidersmart/ng';
import { SharedModule, ContactInputModule, AddressInputModule, EnrollmentInputModule } from '@spidersmart/shared';
import { routes } from './student.routing';
import { StudentListComponent } from './student-list.component';
import { StudentViewComponent } from './student-view.component';
import { StudentFormComponent } from './student-form.component';
import { StudentSubmissionListComponent } from './student-submission-list.component';
import { StudentCheckoutListComponent } from './student-checkout-list.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ContactInputModule,
    AddressInputModule,
    EnrollmentInputModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatTooltipModule,
    MatPasswordStrengthModule,
    TextMaskModule,
    PrintModule,
    ChipsModule
  ],
  providers: [ CookieService ],
  declarations: [StudentListComponent, StudentViewComponent, StudentFormComponent, StudentSubmissionListComponent, StudentCheckoutListComponent],
  exports: [RouterModule]
})
export class StudentModule { }
