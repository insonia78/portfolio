import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndSelectTableComponent } from './search-and-select-table.component';

describe('SearchAndSelectTableComponent', () => {
  let component: SearchAndSelectTableComponent;
  let fixture: ComponentFixture<SearchAndSelectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAndSelectTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAndSelectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
