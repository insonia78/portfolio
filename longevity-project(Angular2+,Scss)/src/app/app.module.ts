import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PatientConnectorComponent } from './patient-connector/patient-connector.component';
import { HeaderWithUserImageComponent } from './header-with-user-image/header-with-user-image.component';
import { PatientComponentTableComponent } from './patient-connector/patient-component-table/patient-component-table.component';
import { RequestIdAndQrScanningComponent } from './patient-connector/request-id-and-qr-scanning/request-id-and-qr-scanning.component';
import { SearchAndSelectTableComponent } from './patient-connector/search-and-select-table/search-and-select-table.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientConnectorComponent,
    HeaderWithUserImageComponent,
    PatientComponentTableComponent,
    RequestIdAndQrScanningComponent,
    SearchAndSelectTableComponent
    
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
