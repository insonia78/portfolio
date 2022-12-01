import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWithUserImageComponent } from './header-with-user-image.component';

describe('HeaderWithUserImageComponent', () => {
  let component: HeaderWithUserImageComponent;
  let fixture: ComponentFixture<HeaderWithUserImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderWithUserImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderWithUserImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
