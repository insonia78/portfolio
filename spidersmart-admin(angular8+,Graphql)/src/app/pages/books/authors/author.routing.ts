import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';
import { AuthorListComponent } from './author-list.component';
import { AuthorFormComponent } from './author-form.component';
import { AuthorViewComponent } from './author-view.component';

export const routes: Routes = [
    {
      path: '',
      component: AuthorListComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.AUTHOR_VIEW]
      }
    },
    {
      path: 'create',
      component: AuthorFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.AUTHOR_CREATE]
      }
    },
    {
      path: ':id/view',
      component: AuthorViewComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.AUTHOR_VIEW]
      }
    },
    {
      path: ':id/edit',
      component: AuthorFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.AUTHOR_UPDATE]
      }
    }
];
