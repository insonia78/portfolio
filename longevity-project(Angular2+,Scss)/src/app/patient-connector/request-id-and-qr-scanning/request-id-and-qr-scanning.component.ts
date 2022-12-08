import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'src/services/getData/get-data.service';
import { Biomarkers, PatientConnector } from '../patient-component-table/patient-connector-table.interface';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
@Component({
  selector: 'app-request-id-and-qr-scanning',
  templateUrl: './request-id-and-qr-scanning.component.html',
  styleUrls: ['./request-id-and-qr-scanning.component.scss']
})
export class RequestIdAndQrScanningComponent implements OnInit {
  
  constructor() {  }

  ngOnInit(): void {
    
  }
  
}
