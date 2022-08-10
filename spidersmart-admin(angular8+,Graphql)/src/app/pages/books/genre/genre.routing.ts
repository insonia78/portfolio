import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';
import { GenreListComponent } from './genre-list.component';
import { GenreViewComponent } from './genre-view.component';
import { GenreFormComponent } from './genre-form.component';

export const routes: Routes = [
    {
      path: '',
      component: GenreListComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.GENRE_VIEW]
      }
    },
    {
      path: 'create',
      component: GenreFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.GENRE_CREATE]
      }
    },
    {
      path: ':id/view',
      component: GenreViewComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.GENRE_VIEW]
      }
    },
    {
      path: ':id/edit',
      component: GenreFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.GENRE_UPDATE]
      }
    }
];
