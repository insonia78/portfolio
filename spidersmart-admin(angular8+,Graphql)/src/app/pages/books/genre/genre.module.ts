import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './genre.routing';
import { SharedModule } from '@spidersmart/shared/shared.module';
import { GenreListComponent } from './genre-list.component';
import { GenreFormComponent } from './genre-form.component';
import { GenreViewComponent } from './genre-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GenreListComponent, GenreViewComponent, GenreFormComponent],
  exports: [RouterModule]
})
export class GenreModule { }
