import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit {
  
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = 'https://www.techiediaries.com/';
  copyedToClipBoard:boolean = false;
  timersArray:any[] = [];
  constructor() {  }

  ngOnInit(): void {
  
  }
  
  regenerateQr(){
    this.elementType = NgxQrcodeElementTypes.URL;
    this.correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
    this.value = `https://www.techiediaries.com/${Math.random() + 10}`
    console.log("2",this.elementType);
  }
  copyToClipBoard(){
    //to be implemented because of deprecations
    // navigator..writeText(this.value);
    
    this.copyedToClipBoard = true;
    const timer = setTimeout(()=>{
      this.copyedToClipBoard = false;
      this.timersArray.forEach((e:any)=> clearTimeout(e));
    },3000)
    this.timersArray.push(timer);
  }

}
