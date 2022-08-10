import { Routes } from '@angular/router';
import { Permission } from '@spidersmart/ng';
import { AuthGuard } from '@spidersmart/shared';
import { SubjectListComponent } from './subject-list.component';
import { SubjectViewComponent } from './subject-view.component';
import { SubjectFormComponent } from './subject-form.component';
import { SubjectLevelListComponent } from './subject-level-list.component';
import { SubjectLevelViewComponent } from './subject-level-view.component';
import { SubjectLevelFormComponent } from './subject-level-form.component';

export const routes: Routes = [
  {
    path: '',
    component: SubjectListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.SUBJECT_VIEW]
    }
  },
  {
    path: 'create',
    component: SubjectFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.SUBJECT_CREATE]
    }
  },
  {
    path: ':id/view',
    component: SubjectViewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.SUBJECT_VIEW]
    }
  },
  {
    path: ':id/edit',
    component: SubjectFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.SUBJECT_UPDATE]
    }
  },
  {
    path: ':id/level',
    component: SubjectLevelListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.LEVEL_VIEW]
    }
  },
  {
    path: ':id/level/:levelId/view',
    component: SubjectLevelViewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.LEVEL_VIEW]
    }
  },
  {
    path: ':id/level/create',
    component: SubjectLevelFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.LEVEL_CREATE]
    }
  },
  {
    path: ':id/level/:levelId/edit',
    component: SubjectLevelFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.LEVEL_UPDATE]
    }
  }
];
