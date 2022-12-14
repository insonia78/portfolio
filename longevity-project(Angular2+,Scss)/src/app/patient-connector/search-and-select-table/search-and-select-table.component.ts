import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'src/services/getData/get-data.service';
import { SearchBiomarkersService } from 'src/services/searchBiomarkers/search-biomarkers.service';
import { Biomarkers } from 'src/interface/patient-connector.interface';

@Component({
  selector: 'app-search-and-select-table',
  templateUrl: './search-and-select-table.component.html',
  styleUrls: ['./search-and-select-table.component.scss','media.component.scss']
})
export class SearchAndSelectTableComponent implements OnInit {
  selected: any = "disease";
  inputValue = "";
  count: number = 0;
  copyArray:Biomarkers[] =[];
  biomarkers:Biomarkers[] = [];
  constructor(private getBiomarkersDataService:GetDataService, private searchBiomarkersService:SearchBiomarkersService) { }

  ngOnInit(): void {
   this.copyArray = this.getBiomarkersDataService.getBiomarkersData();

  }
  
  groupByClicked(event: any): void {
    this.selected = event;
    this.searchBiomarkersService.selectBiomarkers.next(event);
    

  }
  selectAllBiomarkersdisplay(selectedAll: boolean){

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
        
    this.biomarkers = holdArray.length === 0 ? [] : holdArray.sort((a: Biomarkers, b: Biomarkers) => a.biomarkerName.localeCompare(b.biomarkerName));
    
    if(this.biomarkers.length <= 0)
      this.searchBiomarkersService.searchBiomarkers.next( this.copyArray);
    else
      this.searchBiomarkersService.searchBiomarkers.next( this.biomarkers );

    return value;

  }

}
