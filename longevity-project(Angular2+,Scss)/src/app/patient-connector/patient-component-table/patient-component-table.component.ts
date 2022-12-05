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
  inputValue = "";
  copyArray: Biomarkers[] = [];
  count: number = 0;
  pages:Array<number> =[];
  pageSelected:number = 0; 
  constructor() { }

  ngOnInit(): void {

    this.copyArray = data.biomarkers.sort((a: Biomarkers, b: Biomarkers) => a.biomarkerName.localeCompare(b.biomarkerName))
    this.biomarkers = this.copyArray.slice(0,5);
    this.pages = new Array<number>(Math.ceil(( this.copyArray.length ) / 5));
    

  }
  groupByClicked(event: any): void {
    this.selected = event;

  }
  getValue(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.count++;
   
    const array = value.split(",");
    if( array[array.length - 1] === "" )
        array.splice(array.length - 1,1)
       
    let same: boolean = true;
    let holdArray: Biomarkers[] = [];
    for (let i = 0; i < array.length; i++) {
     
      const resultArray:Biomarkers[] = this.copyArray.filter((e: Biomarkers | any) => {
        const bArray = e.biomarkerName.split("");
        const valueA: string = array[i].toUpperCase();
        const valueB: string = bArray.slice(0, array[i].split("").length).join("").toUpperCase();
        if (valueA.localeCompare(valueB) === 0)
          return e;
      })
      resultArray.forEach((e:Biomarkers)=>{
        holdArray.push(e) 
     });
    }
    
    this.biomarkers = holdArray.sort((a: Biomarkers, b: Biomarkers) => a.biomarkerName.localeCompare(b.biomarkerName));
    if(this.biomarkers.length <= 0)
        this.biomarkers = this.copyArray.slice(0,5);
    return value;

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
    this.selectedAll = this.selectedAll.map((e: SelectedAll, index: number) => {
      if (this.selectedAll.find((e: any) => e.selectedType === this.selected) === undefined) {
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


  }
  pageClicked(index:any){
    this.biomarkers = this.copyArray.slice( (5 * index ),5);
    this.pageSelected = index;
    
  }

}
