import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@spidersmart/shared';
import { routes } from './book-checkout.routing';
import { BookCheckoutListComponent } from './book-checkout-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatTooltipModule,
    MatButtonToggleModule
  ],
  declarations: [BookCheckoutListComponent],
  exports: [RouterModule]
})
export class BookCheckoutModule { }
