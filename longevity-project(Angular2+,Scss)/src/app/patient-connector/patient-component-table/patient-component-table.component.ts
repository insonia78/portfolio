import { Component, OnInit } from '@angular/core';
import { Biomarkers, PatientConnector } from './patient-connector-table.interface';
import  data  from "./test-data.json";
@Component({
  selector: 'app-patient-component-table',
  templateUrl: './patient-component-table.component.html',
  styleUrls: ['./patient-component-table.component.scss']
})
export class PatientComponentTableComponent implements OnInit {
  biomarkers:Biomarkers[] = [];
  selected:any="disease"
  clickedBiomarker:string = "";
  constructor() { }

  ngOnInit(): void {
    
    this.biomarkers = data.biomarkers.map((e:any) => e);
  }
  groupByClicked(event:any):void{
    this.selected = event;
  }
  getChekMarkSelected(biomarker:Biomarkers){

          return this.selected === biomarker.biomarkerType && biomarker.checked;

  }
  getBiomarkerType(biomarker:Biomarkers):string{
    return biomarker.biomarkerType;

  }
  selectTheBiomarker(biomarker:Biomarkers){
    biomarker.checked = !biomarker.checked
  }
  getCheckBoxBackGroundSelected(biomarker:Biomarkers){
       return biomarker.checked;
  }
  getCheckBoxBackGroundNotSelected(biomarker:Biomarkers){
    return !biomarker.checked
  }
 }
