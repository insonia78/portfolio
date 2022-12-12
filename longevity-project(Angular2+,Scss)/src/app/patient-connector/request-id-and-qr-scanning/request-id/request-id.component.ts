import { Component, OnInit } from '@angular/core';
import { PatientConnector } from 'src/interface/patient-connector.interface';
import { GetDataService } from 'src/services/getData/get-data.service';

@Component({
  selector: 'app-request-id',
  templateUrl: './request-id.component.html',
  styleUrls: ['./request-id.component.scss','media.component.scss']
})
export class RequestIdComponent implements OnInit {
  patientRequestData:PatientConnector = {} as PatientConnector ;
   constructor(private getDataService:GetDataService) {  }

  ngOnInit(): void {
    this.patientRequestData = this.getDataService.getData();
   
  }
  selectRequestSavingData(patientRequestData:PatientConnector)
  {
       patientRequestData.requestSavingData = !patientRequestData.requestSavingData;
        
  }
  getCheckBoxBackGroundSelected( patientRequestData:PatientConnector ) {
    return patientRequestData.requestSavingData;
  }
  getCheckBoxBackGroundNotSelected( patientRequestData:PatientConnector )  {
    return !patientRequestData.requestSavingData;
  }
  getChekMarkSelected(patientRequestData:PatientConnector){
    return patientRequestData.requestSavingData; 
  }

}
