import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@spidersmart/shared/shared.module';
import { routes } from './author.routing';
import { AuthorListComponent } from './author-list.component';
import { AuthorFormComponent } from './author-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthorViewComponent } from './author-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatFormFieldModule
  ],
  declarations: [AuthorListComponent, AuthorViewComponent, AuthorFormComponent],
  exports: [RouterModule]
})
export class AuthorModule { }
