import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';
import { PublisherListComponent } from './publisher-list.component';
import { PublisherViewComponent } from './publisher-view.component';
import { PublisherFormComponent } from './publisher-form.component';

export const routes: Routes = [
    {
      path: '',
      component: PublisherListComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.PUBLISHER_VIEW]
      }
    },
    {
      path: 'create',
      component: PublisherFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.PUBLISHER_CREATE]
      }
    },
    {
      path: ':id/view',
      component: PublisherViewComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.PUBLISHER_VIEW]
      }
    },
    {
      path: ':id/edit',
      component: PublisherFormComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard],
      data: {
        permissions: [Permission.PUBLISHER_UPDATE]
      }
    }
];
