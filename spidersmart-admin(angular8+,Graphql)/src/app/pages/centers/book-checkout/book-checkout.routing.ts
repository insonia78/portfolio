import { Routes } from '@angular/router';
import { AuthGuard } from '@spidersmart/shared';
import { Permission } from '@spidersmart/ng';

import { BookCheckoutListComponent } from './book-checkout-list.component';

export const routes: Routes = [
  {
    path: '',
    component: BookCheckoutListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.STUDENT_UPDATE]
    }
  }
];
