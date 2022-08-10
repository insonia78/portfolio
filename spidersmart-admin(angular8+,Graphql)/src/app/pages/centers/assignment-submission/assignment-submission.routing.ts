import { Routes } from '@angular/router';
import { AuthGuard } from '@spidersmart/shared';
import { Permission } from '@spidersmart/ng';

import { AssignmentSubmissionListComponent } from './assignment-submission-list.component';
import { AssignmentSubmissionReviewComponent } from './assignment-submission-review.component';

export const routes: Routes = [
  {
    path: '',
    component: AssignmentSubmissionListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_REVIEW]
    }
  },
  {
    path: ':id/review',
    component: AssignmentSubmissionReviewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.ASSIGNMENT_REVIEW]
    }
  }

];
