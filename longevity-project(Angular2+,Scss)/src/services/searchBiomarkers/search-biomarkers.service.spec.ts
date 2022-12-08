import { TestBed } from '@angular/core/testing';

import { SearchBiomarkersService } from './search-biomarkers.service';

describe('SearchBiomarkersService', () => {
  let service: SearchBiomarkersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBiomarkersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
