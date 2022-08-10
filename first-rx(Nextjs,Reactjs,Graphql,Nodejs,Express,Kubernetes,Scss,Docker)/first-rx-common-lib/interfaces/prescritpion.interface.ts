import { DosageInterface } from "./dosage.interface";

export interface PrescriptionsInterface{
        name:String;
        manufacturer:String,
        form:[String],
        dosage:[DosageInterface];
        quantity:[String];

}
