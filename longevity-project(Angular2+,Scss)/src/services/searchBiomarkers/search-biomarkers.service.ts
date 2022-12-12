import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Biomarkers } from 'src/interface/patient-connector.interface';


@Injectable({
  providedIn: 'root'
})
export class SearchBiomarkersService {
  searchBiomarkers = new Subject<Biomarkers[]>();
  selectBiomarkers = new Subject<String>();
  selectedAll = new Subject<void>()
  constructor() { }
}
