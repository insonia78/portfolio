import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentInputComponent } from './enrollment-input.component';

describe('AutocompleteComponent', () => {
  let component: EnrollmentInputComponent;
  let fixture: ComponentFixture<EnrollmentInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
