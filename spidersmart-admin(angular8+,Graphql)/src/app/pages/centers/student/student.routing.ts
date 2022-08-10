import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';

import { StudentListComponent } from './student-list.component';
import { StudentViewComponent } from './student-view.component';
import { StudentFormComponent } from './student-form.component';
import { StudentSubmissionListComponent } from './student-submission-list.component';
import { StudentCheckoutListComponent } from './student-checkout-list.component';

export const routes: Routes = [
  {
    path: '',
    component: StudentListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.STUDENT_VIEW, Permission.STUDENT_VIEW_ASSIGNED]
    }
  },
  {
    path: 'create',
    component: StudentFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.STUDENT_CREATE]
    }
  },
  {
    path: ':id/view',
    component: StudentViewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.STUDENT_VIEW, Permission.STUDENT_VIEW_ASSIGNED]
    }
  },
  {
    path: ':id/edit',
    component: StudentFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.STUDENT_UPDATE]
    }
  },
  {
    path: ':id/assignment-submission',
    component: StudentSubmissionListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_REVIEW]
    }
  },
  {
    path: ':id/book-checkout',
    component: StudentCheckoutListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.STUDENT_UPDATE]
    }
  }
];
