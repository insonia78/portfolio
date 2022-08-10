import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectStudentDialogComponent } from './select-student-dialog.component';
import { SelectAssignmentDialogComponent } from './select-assignment-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  declarations: [SelectStudentDialogComponent, SelectAssignmentDialogComponent],
  exports: [SelectStudentDialogComponent, SelectAssignmentDialogComponent]
})
export class DialogModule {
  constructor() {
  }
}
