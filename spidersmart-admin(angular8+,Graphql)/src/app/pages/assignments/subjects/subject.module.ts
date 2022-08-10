import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@spidersmart/shared/shared.module';

import { routes } from './subject.routing';

import { SubjectListComponent } from './subject-list.component';
import { SubjectFormComponent } from './subject-form.component';
import { SubjectViewComponent } from './subject-view.component';
import { SubjectLevelListComponent } from './subject-level-list.component';
import { SubjectLevelViewComponent } from './subject-level-view.component';
import { SubjectLevelFormComponent } from './subject-level-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatSelectModule
  ],
  declarations: [SubjectListComponent, SubjectViewComponent, SubjectFormComponent, SubjectLevelListComponent, SubjectLevelViewComponent, SubjectLevelFormComponent],
  exports: [RouterModule]
})
export class SubjectModule { }
