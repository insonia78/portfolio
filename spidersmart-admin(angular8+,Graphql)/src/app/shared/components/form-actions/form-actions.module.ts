import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormActionsComponent } from './form-actions.component';
import { FormActionComponent } from './form-action.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  declarations: [FormActionsComponent, FormActionComponent],
  exports: [FormActionsComponent, FormActionComponent]
})
export class FormActionsModule { }
