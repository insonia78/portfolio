import { EmployeeInterface } from "./employee.interface";


export interface PayloadInterface{
    code:number;
    message:[EmployeeInterface|any];
}