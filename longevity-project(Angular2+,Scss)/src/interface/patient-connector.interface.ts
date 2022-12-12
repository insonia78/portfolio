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
    requestID:string,
    expireBy:string,
    requestSavingData:boolean,
    deleteDataAfter:string,
    biomarkers:Biomarkers[],
    
}
export interface SelectedAll{
    checked:boolean,
    selectedType:string
}
