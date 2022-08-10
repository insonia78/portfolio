import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { PrintModule, AutocompleteModule } from '@spidersmart/ng';
import { SharedModule } from '@spidersmart/shared/shared.module';
import { routes } from './assignment.routing';
import { AssignmentListComponent } from './assignment-list.component';
import { AssignmentFormComponent } from './assignment-form.component';
import { AssignmentViewComponent } from './assignment-view.component';
import { AssignmentAnswerKeyComponent } from './assignment-answer-key.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatFabMenuModule,
    DragDropModule,
    AutocompleteModule,
    PrintModule,
    QuillModule.forRoot()
  ],
  declarations: [AssignmentListComponent, AssignmentViewComponent, AssignmentFormComponent, AssignmentAnswerKeyComponent],
  exports: [RouterModule]
})
export class AssignmentModule { }
