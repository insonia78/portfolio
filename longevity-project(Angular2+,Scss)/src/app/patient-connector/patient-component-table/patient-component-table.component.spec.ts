import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientComponentTableComponent } from './patient-component-table.component';

describe('PatientComponentTableComponent', () => {
  let component: PatientComponentTableComponent;
  let fixture: ComponentFixture<PatientComponentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientComponentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientComponentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
