import { Routes } from '@angular/router';
import { AuthGuard } from '@spidersmart/shared';
import { Permission } from '@spidersmart/ng';

import { TeacherListComponent } from './teacher-list.component';
import { TeacherViewComponent } from './teacher-view.component';
import { TeacherFormComponent } from './teacher-form.component';
import { TeacherStudentListComponent } from './teacher-student-list.component';

export const routes: Routes = [
  {
    path: '',
    component: TeacherListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.TEACHER_VIEW]
    }
  },
  {
    path: 'create',
    component: TeacherFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.TEACHER_CREATE]
    }
  },
  {
    path: ':id/view',
    component: TeacherViewComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.TEACHER_VIEW]
    }
  },
  {
    path: ':id/edit',
    component: TeacherFormComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.TEACHER_UPDATE]
    }
  },
  {
    path: ':id/student',
    component: TeacherStudentListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      permissions: [Permission.STUDENT_ASSIGN]
    }
  }
];
