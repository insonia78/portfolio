import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';
import { ApprovedBookListComponent } from './approved-book-list.component';
import { ApprovedBookViewComponent } from './approved-book-view.component';
import { ApprovedBookFormComponent } from './approved-book-form.component';

export const routes: Routes = [
    {
      path: '',
      component: ApprovedBookListComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.BOOK_VIEW]
      }
    },
    {
      path: 'create',
      component: ApprovedBookFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.BOOK_CREATE]
      }
    },
    {
      path: ':id/view',
      component: ApprovedBookViewComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.BOOK_VIEW]
      }
    },
    {
      path: ':id/edit',
      component: ApprovedBookFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.BOOK_UPDATE]
      }
    }
];
