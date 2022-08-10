import { Component, Inject, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { take, debounceTime, takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student, StudentService, GraphQLResponse, GraphQLQueryFilter } from '@spidersmart/ng';
import { combineLatest, Subject } from 'rxjs';
import { AppContextService, AppContextCenter } from '@spidersmart/core';

export interface SelectStudentDialogData {
  title: string;
  description: string;
  exclude: Student[];
  filterDebounceTime: number;
  filterMinLength: number;
}

@Component({
  selector: 'sm-select-student.dialog',
  styleUrls: ['./dialog.component.scss'],
  template: `
    <h1 mat-dialog-title>{{data.title}}</h1>
    <div mat-dialog-content>
      <form>
        <p>{{data.description}}</p>
        <mat-form-field appearance="outline" style="width: 100%">
            <input matInput type="text" placeholder="Choose student(s)" [formControl]="filter" [matAutocomplete]="auto" #filterInput>
            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="addStudent($event.option.value)" [displayWith]="displayFunction">
              <mat-option *ngIf="filterLoading"><mat-progress-bar mode="indeterminate"></mat-progress-bar></mat-option>
              <ng-container *ngIf="!filterLoading">
                <mat-option *ngFor="let student of availableStudents" [value]="student">{{student?.lastName}}, {{student?.firstName}}</mat-option>
              </ng-container>
            </mat-autocomplete>
        </mat-form-field>
      </form>
      <mat-list *ngIf="selectedStudents.length > 0">
        <mat-list-item *ngFor="let student of selectedStudents">
          <div mat-line>{{student.lastName}}, {{student.firstName}}</div>
          <button mat-icon-button color="warn" (click)="removeStudent(student)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>
    </div>
    <div mat-dialog-actions>
      <button mat-button type="secondary" [mat-dialog-close]="[]">Cancel</button>
      <button mat-flat-button type="primary" class="primary" [mat-dialog-close]="selections" [disabled]="selectedStudents.length < 1">Add {{selectedStudents.length > 0 ? selectedStudents.length : ''}} Student(s)</button>
    </div>
  `,
})
export class SelectStudentDialogComponent implements OnInit, OnDestroy {
  /**
   * The list of available students from which selection can be made
   */
  public availableStudents: Student[] = [];

  /**
   * The list of currently selected students
   */
  public selectedStudents: Student[] = [];

  /**
   * The filter control
   */
  public filter = new FormControl();

  /**
   * If the filter is loading
   */
  public filterLoading = false;

  /** 
   * Reference to the current users accessible centers 
   */
  private accessibleCenters: AppContextCenter[] = [];

  /** 
   * Reference to the current selected center 
   */
  private currentCenter: AppContextCenter = null;

  /**
   * The list of students to exclude from lookups
   */
  private excludedStudents: Student[] = [];

  /**
   * The amount of time that needs to elapse before a change in the filter is acted upon (in milliseconds)
   */
  private filterDebounceTime = 600;

  /**
   * The minimum number of characters entered into the filter to trigger filtering
   */
  private filterMinLength = 3;

  /**
   * The current filter value, used to determine if a change should trigger a lookup
   */
  private filterValue = '';

  /**
   * Subject to ensure all subscriptions close when element is destroyed 
   */
  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * Accessor for the output which should occur when selections are confirmed
   */
  public get selections(): Student[] {
    return this.selectedStudents;
  }

  /**
   * The input to filter selections
   */
  @ViewChild('filterInput') filterInput: ElementRef;

  /**
   * @ignore
   */
  constructor(
    public dialogRef: MatDialogRef<SelectStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectStudentDialogData,
    private studentService: StudentService,
    private appContextService: AppContextService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    // set data properties to local properties
    this.excludedStudents = (this.data.hasOwnProperty('exclude') && Array.isArray(this.data.exclude)) ? this.data.exclude : this.excludedStudents;
    this.filterDebounceTime = (this.data.hasOwnProperty('filterDebounceTime')) ? this.data.filterDebounceTime : this.filterDebounceTime;
    this.filterMinLength = (this.data.hasOwnProperty('filterMinLength')) ? this.data.filterMinLength : this.filterMinLength;

    // get the current center context so that the available students list can be restricted by the centers which are being viewed
    combineLatest([
      this.appContextService.getCenter(),
      this.appContextService.getAccessibleCenters()
    ]).pipe(take(1)).subscribe(([center, accessibleCenters]) => {
      this.accessibleCenters = accessibleCenters;
      this.currentCenter = center;
    }); 

    this.filter.valueChanges.pipe(
      debounceTime(this.filterDebounceTime),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(value => {
      if (value.length >= this.filterMinLength) {
        this.filterValue = value;
        this.loadStudents();
      } else if (value.length < this.filterMinLength && this.filterValue.length >= this.filterMinLength) {
        this.availableStudents = [];
        this.filterValue = '';
      }
    });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Adds a student to the selected students list
   * @param student The student to add
   */
  public addStudent(student: Student): void {
    this.selectedStudents.push(student);
    this.filter.setValue('');
    this.filterInput.nativeElement.blur();
  }

  /**
   * Removes a student from the selected students list
   * @param student The student to remove
   */
  public removeStudent(student: Student): void {
    const studentIndex = this.selectedStudents.findIndex(selectedStudent => student.id === selectedStudent.id);
    if (studentIndex >= 0) {
      this.selectedStudents.splice(studentIndex, 1);
    }
  }

  /**
   * Defines what should display in the selection menu for a given student
   * @param student The student details to display
   * @return The value to display
   */
  public displayFunction(student: Student): string {
    return student ? student.lastName + ', ' + student.firstName  : '';
  }

  /**
   * Load students into the selector based on given filter value
   */
  private loadStudents(): void {
    // set center restriction to current center context
    const centers = (this.currentCenter !== null) ? this.currentCenter.id : this.accessibleCenters.map(ctr => Number(ctr.id));

    // set restrictions on already associated students and based on filter value
    const filters = [];
    if (this.excludedStudents.length > 0) {
      filters.push({
        field: "id",
        values: this.excludedStudents.map(student => student.id),
        comparison: "!in"
      });
    }
    if (this.selectedStudents.length > 0) {
      filters.push({
        field: "id",
        values: this.selectedStudents.map(student => student.id),
        comparison: "!in"
      });
    }
    filters.push({
      field: "name",
      value: this.filterValue,
      comparison: "contains"
    });

    // load student data
    this.filterLoading = true;
    this.studentService.getAllFromCenter(centers,{ filters: filters }).pipe(take(1)).subscribe((students: GraphQLResponse<Student[]>) => {
      this.filterLoading = false;
      this.availableStudents = students.data;
    });
  }
}
