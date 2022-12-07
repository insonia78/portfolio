import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIdAndQrScanningComponent } from './request-id-and-qr-scanning.component';

describe('RequestIdAndQrScanningComponent', () => {
  let component: RequestIdAndQrScanningComponent;
  let fixture: ComponentFixture<RequestIdAndQrScanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestIdAndQrScanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestIdAndQrScanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
