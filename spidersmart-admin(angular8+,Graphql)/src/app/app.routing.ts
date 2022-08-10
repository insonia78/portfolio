import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccessGuard } from './shared';

export const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate: [AccessGuard],
    canLoad: [AccessGuard],
    data: {
      noReuse: true
    }
  },
  { path: 'center', loadChildren: () => import('./pages/centers/center/center.module').then(m => m.CenterModule), data: { noReuse: true } },
  { path: 'student', loadChildren: () => import('./pages/centers/student/student.module').then(m => m.StudentModule), data: { noReuse: true } },
  { path: 'teacher', loadChildren: () => import('./pages/centers/teacher/teacher.module').then(m => m.TeacherModule), data: { noReuse: true } },
  { path: 'assignment', loadChildren: () => import('./pages/assignments/assignment.module').then(m => m.AssignmentModule), data: { noReuse: true } },
  { path: 'subject', loadChildren: () => import('./pages/assignments/subjects/subject.module').then(m => m.SubjectModule), data: { noReuse: true } },
  { path: 'approved-books', loadChildren: () => import('./pages/books/approved-books/approved-book.module').then(m => m.ApprovedBookModule), data: { noReuse: true } },
  { path: 'authors', loadChildren: () => import('./pages/books/authors/author.module').then(m => m.AuthorModule), data: { noReuse: true } },
  { path: 'publisher', loadChildren: () => import('./pages/books/publisher/publisher.module').then(m => m.PublisherModule), data: { noReuse: true } },
  { path: 'genre', loadChildren: () => import('./pages/books/genre/genre.module').then(m => m.GenreModule), data: { noReuse: true } },
  { path: 'assignment-submission', loadChildren: () => import('./pages/centers/assignment-submission/assignment-submission.module').then(m => m.AssignmentSubmissionModule), data: { noReuse: true } },
  { path: 'book-checkout', loadChildren: () => import('./pages/centers/book-checkout/book-checkout.module').then(m => m.BookCheckoutModule), data: { noReuse: true } },

];

