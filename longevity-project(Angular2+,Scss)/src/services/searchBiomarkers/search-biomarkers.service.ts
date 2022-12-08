import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Biomarkers } from 'src/app/patient-connector/patient-component-table/patient-connector-table.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchBiomarkersService {
  searchBiomarkers = new Subject<Biomarkers[]>();
  selectBiomarkers = new Subject<String>();
  selectedAll = new Subject<void>()
  constructor() { }
}
