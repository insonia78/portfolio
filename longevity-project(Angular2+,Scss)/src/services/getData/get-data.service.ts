import { Injectable } from '@angular/core';
import { Biomarkers, PatientConnector } from 'src/interface/patient-connector.interface';
import data from "./../../testData/test-data.json";



@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private biomarkersData:PatientConnector;
  constructor() {

    this.biomarkersData = data;
   }

  
 getBiomarkersData():Biomarkers[] {
   return this.biomarkersData.biomarkers.sort((a: Biomarkers, b: Biomarkers) => a.biomarkerName.localeCompare(b.biomarkerName));;
  }
  getData(){
    return data;
  }


}
