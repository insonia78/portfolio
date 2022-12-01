
export interface Biomarkers {
    biomarkerName:string,
    unit:string,
    description:string,
    expiredBy:string,
    deleteDataAfter:string,
    checked:boolean,
    biomarkerType:string
 
 }

export interface PatientConnector {
    biomarkers:Biomarkers[],
    
}
