import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConnectorComponent } from './patient-connector.component';

describe('PatientConnectorComponent', () => {
  let component: PatientConnectorComponent;
  let fixture: ComponentFixture<PatientConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientConnectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
