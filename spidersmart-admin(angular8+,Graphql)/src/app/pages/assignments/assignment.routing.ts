import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';
import { AssignmentListComponent } from './assignment-list.component';
import { AssignmentViewComponent } from './assignment-view.component';
import { AssignmentFormComponent } from './assignment-form.component';
import { AssignmentAnswerKeyComponent } from './assignment-answer-key.component';

export const routes: Routes = [
  {
    path: '',
    component: AssignmentListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_VIEW]
    }
  },
  {
    path: 'create',
    component: AssignmentFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_CREATE]
    }
  },
  {
    path: ':id/view',
    component: AssignmentViewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_VIEW]
    }
  },
  {
    path: ':id/answer-key',
    component: AssignmentAnswerKeyComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_VIEW]
    }
  },
  {
    path: ':id/edit',
    component: AssignmentFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_UPDATE]
    }
  }
];
