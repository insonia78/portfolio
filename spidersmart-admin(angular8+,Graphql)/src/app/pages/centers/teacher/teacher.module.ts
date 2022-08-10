import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule, ContactInputModule, AddressInputModule, EnrollmentInputModule } from '@spidersmart/shared';
import { routes } from './teacher.routing';
import { TeacherListComponent } from './teacher-list.component';
import { TeacherViewComponent } from './teacher-view.component';
import { TeacherFormComponent } from './teacher-form.component';
import { TeacherStudentListComponent } from './teacher-student-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContactInputModule,
    AddressInputModule,
    EnrollmentInputModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatTooltipModule,
    MatPasswordStrengthModule,
    TextMaskModule
  ],
  declarations: [TeacherListComponent, TeacherViewComponent, TeacherFormComponent, TeacherStudentListComponent],
  exports: [RouterModule]
})
export class TeacherModule { }
