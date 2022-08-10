import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';
import { CenterListComponent } from './center-list.component';
import { CenterViewComponent } from './center-view.component';
import { CenterFormComponent } from './center-form.component';
import { CenterInventoryComponent } from './center-inventory.component';

export const routes: Routes = [
  {
    path: '',
    component: CenterListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.CENTER_VIEW]
    }
  },
  {
    path: 'create',
    component: CenterFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.CENTER_CREATE]
    }
  },
  {
    path: ':id/view',
    component: CenterViewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.CENTER_VIEW]
    }
  },
  {
    path: ':id/edit',
    component: CenterFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.CENTER_UPDATE]
    }
  },
  {
    path: ':id/book-inventory',
    component: CenterInventoryComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.CENTER_MANAGE_BOOKS]
    }
  }
];
