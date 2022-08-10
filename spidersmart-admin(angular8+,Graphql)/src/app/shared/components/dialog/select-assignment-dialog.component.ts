import { Component, Inject, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { take, startWith, map, takeUntil, debounceTime } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Assignment, AssignmentService, GraphQLResponse, Student, Enrollment, Center } from '@spidersmart/ng';
import { Observable, Subject } from 'rxjs';

export interface SelectAssignmentDialogData {
  title: string;
  description: string;
  exclude: Assignment[];
  student: Student;
  accessibleCenters: Center[];
  isRestrictedToLevel: boolean;
  filterDebounceTime: number;
  filterMinLength: number;
}

@Component({
  selector: 'sm-select-assignment.dialog',
  styleUrls: ['./dialog.component.scss'],
  template: `
    <h1 mat-dialog-title>{{data.title}}</h1>
    <div mat-dialog-content>
      <form>
        <p>{{data.description}}</p>

        <mat-form-field appearance="outline" style="width: 100%;" *ngIf="this.enrollments.length > 1">
          <mat-label>Enrollment</mat-label>
          <mat-select [formControl]="selectedEnrollment">
            <mat-option *ngFor="let enrollment of enrollments" [value]="enrollment">
              {{enrollment?.center?.name}}: {{enrollment?.level?.subject?.name}} {{enrollment?.level?.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width: 100%" *ngIf="enrollments.length === 1 || this.selectedEnrollment.value">
            <input matInput type="text" placeholder="Choose assignment(s)" [formControl]="filter" [matAutocomplete]="auto" #filterInput>
            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="addAssignment($event.option.value)" [displayWith]="displayFunction">
              <mat-option *ngIf="filterLoading"><mat-progress-bar mode="indeterminate"></mat-progress-bar></mat-option>
              <ng-container *ngIf="!filterLoading">
                <mat-option *ngFor="let assignment of availableAssignments" [value]="assignment">{{assignment.title}}</mat-option>
              </ng-container>
            </mat-autocomplete>
        </mat-form-field>
      </form>
      <mat-list *ngIf="selectedAssignments.length > 0">
        <mat-list-item *ngFor="let assignment of selectedAssignments">
          <div mat-line>{{assignment.title}}</div>
          <button mat-icon-button color="warn" (click)="removeAssignment(assignment)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>
    </div>
    <div mat-dialog-actions>
      <button mat-button type="secondary" [mat-dialog-close]="[]">Cancel</button>
      <button mat-flat-button type="primary" class="primary" [mat-dialog-close]="selections" [disabled]="selectedAssignments.length < 1">Add {{selectedAssignments.length > 0 ? selectedAssignments.length : ''}} Assignment(s)</button>
    </div>
  `,
})
export class SelectAssignmentDialogComponent implements OnInit, OnDestroy {
  /**
   * The list of available enrollments for the student
   */
  public enrollments: Enrollment[] = [];

  /**
   * The list of currently selected assignments
   */
  public selectedAssignments: Assignment[] = [];

  /**
   * The list of available assignments based on other settings in component
   */
  public availableAssignments: Assignment[] = [];

  /**
   * The enrollment selection control
   */
  public selectedEnrollment = new FormControl();

  /**
   * The filter control
   */
  public filter = new FormControl();

  /**
   * If the filter is loading
   */
  public filterLoading = false;

  /**
   * The list of assignments to exclude from lookups
   */
  private excludedAssignments: Assignment[] = [];

  /**
   * Whether the assignment selection should be restricted to a students given level
   */
  private isRestrictedToLevel = true;

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
  public get selections(): {enrollment: Enrollment, assignments: Assignment[]} {
    return {
      enrollment: this.selectedEnrollment.value,
      assignments: this.selectedAssignments
    }
  }

  /**
   * The input to filter selections
   */
  @ViewChild('filterInput') filterInput: ElementRef;

  /**
   * @ignore
   */
  constructor(
    public dialogRef: MatDialogRef<SelectAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectAssignmentDialogData,
    private assignmentService: AssignmentService
  ) { }

  /**
   * @ignore
   */
  ngOnInit() {
    this.filterDebounceTime = (this.data.hasOwnProperty('filterDebounceTime')) ? this.data.filterDebounceTime : this.filterDebounceTime;
    this.filterMinLength = (this.data.hasOwnProperty('filterMinLength')) ? this.data.filterMinLength : this.filterMinLength;
    
    // set available enrollments
    if (!this.data.hasOwnProperty('student') || !this.data.student.hasOwnProperty('enrollments')) {
      console.warn('The select assignment dialog requires a student to be set.');
      return;
    }
    if (!this.data.hasOwnProperty('accessibleCenters') || !Array.isArray(this.data.accessibleCenters)) {
      console.error('The user does not have any accessible centers for which to assign the student assignments. Please reload the application.');
      return;
    }

    // set available enrollments to be restricted to only the centers which the current user can access
    this.enrollments = this.data.student.enrollments.filter((enrollment: Enrollment) => {
      for (let i = 0; i < this.data.accessibleCenters.length; i++) {
        if (Number(this.data.accessibleCenters[i].id) === enrollment.center.id) {
          return true;
        }
      }
      return false;
    });
    if (this.enrollments.length <  1) {
      console.error('The selected student does not have any enrollments which are available to assign a new assignment.');
      return;
    }    

    // set any excluded assignments
    this.excludedAssignments = (this.data.hasOwnProperty('exclude') && Array.isArray(this.data.exclude)) ? this.data.exclude : [];

    // handle level restriction
    this.isRestrictedToLevel = (this.data.hasOwnProperty('isRestrictedToLevel') && this.data.isRestrictedToLevel);

    // when the enrollment selection changes (or is set automatically by virtue of there only being one), load new assignment options
    if (this.enrollments.length === 1) {
      this.selectedEnrollment.setValue(this.enrollments[0]);
      this.loadAssignments();
    } else {
      this.selectedEnrollment.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(enrollment => {
        this.loadAssignments();
        this.selectedAssignments = [];
        this.filter.setValue('');
      });
    }

    this.filter.valueChanges.pipe(
      debounceTime(this.filterDebounceTime),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(value => {
      if (value.length >= this.filterMinLength) {
        this.filterValue = value;
        this.loadAssignments();
      } else if (value.length < this.filterMinLength && this.filterValue.length >= this.filterMinLength) {
        this.availableAssignments = [];
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
   * Adds an assignment to the selections list
   * @param assignment The assignment to add
   */
  public addAssignment(assignment: Assignment): void {
    this.selectedAssignments.push(assignment);
    this.filter.setValue('');
    this.filterInput.nativeElement.blur();
  }

  /**
   * Removes an assignment from the selections list
   * @param assignment The assignment to remove
   */
  public removeAssignment(assignment: Assignment): void {
    const assignmentIndex = this.selectedAssignments.findIndex(selectedAssignment => assignment.id === selectedAssignment.id);
    if (assignmentIndex >= 0) {
      this.selectedAssignments.splice(assignmentIndex, 1);
    }
  }

  /**
   * Defines what should display in the selection menu for a given assignment
   * @param assignment The assignment details to display
   * @return The value to display
   */
  public displayFunction(assignment: Assignment): string {
    return assignment && assignment.title ? assignment.title : '';
  }

  /**
   * Load assignments into the selector based on given filter value
   */
  private loadAssignments(): void {
    // set restrictions on already associated students and based on filter value
    const filters = [];
    if (this.excludedAssignments.length > 0) {
      filters.push({
        field: "id",
        values: this.excludedAssignments.map(student => student.id),
        comparison: "!in"
      });
    }
    if (this.selectedAssignments.length > 0) {
      filters.push({
        field: "id",
        values: this.selectedAssignments.map(student => student.id),
        comparison: "!in"
      });
    }
    if (this.selectedEnrollment) {
      if (this.isRestrictedToLevel) {
        filters.push({
          field: "level",
          value: this.selectedEnrollment.value.level.id
        })
      } else {
        filters.push({
          field: "subject",
          value: this.selectedEnrollment.value.level.subject.id
        })
      }
    }
    filters.push({
      field: "title",
      value: this.filterValue,
      comparison: "contains"
    });

    // load assignment data
    this.filterLoading = true;
    this.assignmentService.getAll({ filters: filters }).pipe(take(1)).subscribe((assignments: GraphQLResponse<Assignment[]>) => {
      this.filterLoading = false;
      this.availableAssignments = assignments.data;
    });
  }
}
