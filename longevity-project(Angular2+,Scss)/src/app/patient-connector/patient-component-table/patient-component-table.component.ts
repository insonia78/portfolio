import { Component, OnInit } from '@angular/core';
import { Biomarkers, PatientConnector, SelectedAll } from './patient-connector-table.interface';
import data from "./test-data.json";
@Component({
  selector: 'app-patient-component-table',
  templateUrl: './patient-component-table.component.html',
  styleUrls: ['./patient-component-table.component.scss']
})
export class PatientComponentTableComponent implements OnInit {
  biomarkers: Biomarkers[] = [];
  selected: any = "disease"
  clickedBiomarker: string = "";
  selectedAll: SelectedAll[] = [];
  checkedAll: boolean = false;
  constructor() { }

  ngOnInit(): void {

    this.biomarkers = data.biomarkers.map((e: any) => e);
  }
  groupByClicked(event: any): void {
    this.selected = event;

  }
  getChekMarkSelected(biomarker: Biomarkers) {

    return this.selected === biomarker.biomarkerType && biomarker.selected;

  }
  getBiomarkerType(biomarker: Biomarkers): string {
    return biomarker.biomarkerType;

  }
  selectTheBiomarker(biomarker: Biomarkers) {
    biomarker.selected = !biomarker.selected
  }
  getCheckBoxBackGroundSelected(biomarker: Biomarkers) {
    return biomarker.selected;
  }
  getCheckBoxBackGroundNotSelected(biomarker: Biomarkers) {
    return !biomarker.selected
  }
  selectAllBiomarkersdisplay(selectedAll: boolean) {
    this.biomarkers = data.biomarkers.map((e: any) => {

      if (this.selected === e.biomarkerType)
        e.selected = !selectedAll;
      return e;
    })
    this.selectedAll = this.selectedAll.map((e: SelectedAll,index:number) => {
      if (this.selectedAll.find( (e:any) => e.selectedType === this.selected) === undefined) {
        e.selectedType = this.selected;
        e.checked = !selectedAll
        this.checkedAll = !selectedAll
        return e;
      }
      if (this.selected === e.selectedType && e.checked === selectedAll) {
        e.checked = !selectedAll;
        this.checkedAll = !selectedAll
        return e;
      }
      if (this.selected === e.selectedType && e.checked !== selectedAll) {
        e.checked = selectedAll;
        this.checkedAll = selectedAll
        return e;
      }
      return e;
    })
    if (this.selectedAll.length <= 0) {
      this.selectedAll.push({
        selectedType: this.selected,
        checked: !selectedAll

      }
      )
      this.checkedAll = !selectedAll;
    }

    console.log(this.checkedAll);
    console.log(this.selectedAll);
  }

}
