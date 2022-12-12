import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'src/services/getData/get-data.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
@Component({
  selector: 'app-request-id-and-qr-scanning',
  templateUrl: './request-id-and-qr-scanning.component.html',
  styleUrls: ['./request-id-and-qr-scanning.component.scss','media.component.scss']
})
export class RequestIdAndQrScanningComponent implements OnInit {
  
  constructor() {  }

  ngOnInit(): void {
    
  }
  
}
