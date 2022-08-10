import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './publisher.routing';
import { SharedModule } from '@spidersmart/shared/shared.module';
import { PublisherListComponent } from './publisher-list.component';
import { PublisherFormComponent } from './publisher-form.component';
import { PublisherViewComponent } from './publisher-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PublisherListComponent, PublisherViewComponent, PublisherFormComponent],
  exports: [RouterModule]
})
export class PublisherModule { }
