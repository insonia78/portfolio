import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, BehaviorSubject, isObservable, throwError, forkJoin } from 'rxjs';
import { take, takeUntil, finalize, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Teacher, TeacherService, Student, GraphQLResponse, ConfirmDialogComponent, Permission, DatatableDataRequest } from '@spidersmart/ng';
import { SelectStudentDialogComponent } from '@spidersmart/shared';
import { PageActions, PageService, AppContextService } from '@spidersmart/core';

/**
 * Component to display list of all teachers
 */
@Component({
  selector: 'sm-teacher-student-list',
  templateUrl: './teacher-student-list.component.html'
})
export class TeacherStudentListComponent implements OnInit {
  /**
   * Reference to permissions enum for template access
   */
  public Permission = Permission;

  /**
   * The current teacher
   */
  public teacher: Teacher = null;

  /** 
   * Subject of current student data, we need this to trigger changes to the data source from this end
   */
  public students: BehaviorSubject<GraphQLResponse<Student[]>> = new BehaviorSubject<GraphQLResponse<Student[]>>({
    loading: true,
    data: []
  });

  /**
   * @ignore
   */
  constructor(
    private appContextService: AppContextService,
    private activatedRoute: ActivatedRoute,
    private teacherService: TeacherService,
    private pageService: PageService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.pageService.setTitle('Manage Teacher\'s Students');

    if (this.activatedRoute.snapshot.params.hasOwnProperty('id')) {
      this.teacher = { id: this.activatedRoute.snapshot.params.id } as Teacher;

      // get teachers name for title
      this.teacherService.get(this.activatedRoute.snapshot.params.id).pipe(take(1)).subscribe((teacher: GraphQLResponse<Teacher>) => {
        this.teacher = teacher.data;
        this.pageService.setTitle('Manage Students for ' + teacher.data.firstName + ' ' + teacher.data.lastName);
      });

      if (this.appContextService.hasPermission(Permission.STUDENT_ASSIGN)) {
        this.pageService.addFunctionAction(PageActions.create, this.assignStudent, [this.activatedRoute.snapshot.params.id]);
      }
    }
  }

  /**
   * Loads teacher's student data
   * @param event Request data event from table component
   */
  public loadData(event: DatatableDataRequest): void {
    // reset table status to force loading state
    this.students.next({
      loading: true,
      data: []
    });

    // update data 
    this.teacherService.getStudents(this.teacher.id, {
      page: {
        size: event.limit,
        start: event.offset
      },
      sort: {
        field: event.sort,
        direction: event.order
      },
      filters: [
        { field: 'name', value: event.filter, comparison: 'contains' }
      ]
    }).pipe(take(1)).subscribe((students: GraphQLResponse<Student[]>) => {
      console.log(students);
      this.students.next(students);
    });
  }

  /**
   * Add a new student or students
   */
  public assignStudent = () => {
    const addStudentDialog = this.dialog.open(SelectStudentDialogComponent, {
      width: '500px',
      data: {
        title: 'Add Students',
        description: 'Choose the student(s) you would like to add to this teacher:',
        exclude: this.students.getValue().data
      }
    });

    addStudentDialog.afterClosed().subscribe((students: Student[]) => {
      if (students && students.length > 0) {
        this.pageService.setLoading(true);

        // build a list of request to make, one for each new book that is to be checked out
        const requests = [];
        students.forEach(student => {
          requests.push(this.teacherService.assignStudent(this.teacher,student));
        });

        // send the requests
        forkJoin(requests).pipe(
          catchError((err) => {
            this.pageService.setLoading(false);
            this.toastService.error('The student(s) could not be assigned.');
            return throwError(err);
          }),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe((response: GraphQLResponse<Student>[]) => {
          // update the assignment list with any successfully assigned students and keep track of how many errors exist
          let errors = 0;
          let currentStudents = this.students.getValue();
          response.forEach((result: GraphQLResponse<Student>) => {
            if (result.success) {
              result.data['relatedFrom'] = new Date();
              currentStudents.data.push(result.data);
            } else {
              errors++;
            }
          });

          // show the correct response based on how many errors occurred and update the students list if necessary
          if (errors >= requests.length) {
            this.toastService.error('The student(s) could not be assigned.');
          } else {
            if (errors > 0) {
              this.toastService.warning(errors + ' of the ' + requests.length + ' student(s) failed to assign.');
            } else {
              this.toastService.success('The student(s) were assigned successfully!');
            }
            this.students.next(this.teacherService.createQueryResponse<Student[]>(currentStudents.data));
          }
        });
      }
    });
  }

  /**
   * Unassigns student from the teacher
   * @param id The id of the student which should be removed
   */
  public unassignStudent = (id: number) => {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Unassign Student',
        question: 'Are you sure you want to unassign this student?'
      }
    });

    confirmDeleteDialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed === true) {
        this.teacherService.unassignStudent(this.teacher,{id: id} as Student).pipe(
          catchError((err) => {
            this.pageService.setLoading(false);
            this.toastService.error('The student(s) could not be unassigned.');
            return throwError(err);
          }),
          finalize(() => {
            this.pageService.setLoading(false);
          })
        ).subscribe((response: GraphQLResponse<Student>) => {
          if (response.success) {
            let currentStudents = this.students.getValue();
            const studentIndex = currentStudents.data.findIndex(student => student.id === id);
            if (studentIndex > -1) {
              currentStudents.data.splice(studentIndex, 1);
              this.students.next(this.teacherService.createQueryResponse<Student[]>(currentStudents.data));
            }
            this.toastService.success('The student(s) were unassigned successfully!');
          }
        });
      }
    });
  }
}
