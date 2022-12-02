
export interface Biomarkers {
    biomarkerName:string,
    unit:string,
    description:string,
    expiredBy:string,
    deleteDataAfter:string,
    selected:boolean,
    biomarkerType:string
 
 }

export interface PatientConnector {
    biomarkers:Biomarkers[],
    
}
export interface SelectedAll{
    checked:boolean,
    selectedType:string
}
