import { stringArg, queryType, extendType } from "@nexus/schema";
import  Prescriptions  from "./Prescriptions";
import { data } from "../data";

 const Mutation = extendType({
    type:'Mutation',
    definition(t){
         t.list.field("prescriptions",{
             type: Prescriptions,
             resolve:() => data.prescritions,
         });

         t.list.field("prescription",{
             type:Prescriptions,             
             args:{prescription: stringArg()},
             resolve:(root,{prescription}:{prescription:string}, ctx)=>{
                 let ar = [];
                 let lenght_of_the_prescription_to_search = prescription.trim().length;
                 let it_matches = true; 
                data.prescritions.forEach((value) =>{
                          
                         let v = value.name.toLowerCase();
                         let ge = value.generic_name.toLowerCase();
                         let buildt_search_name_by_prescription_name = `${v} (${ge})`;
                         let buildt_search_name_by_prescription_generic = `${ge} (${v})`;
                         it_matches = true;
                        
                        if(buildt_search_name_by_prescription_name.localeCompare(prescription.toLowerCase()) === 0)
                        {
                            Object.assign(value,{search_name:`${value.name} (${value.generic_name})`})
                            ar.push(value);
                            return ar;
                        }                                            
                        
                        if(buildt_search_name_by_prescription_generic.localeCompare(prescription.toLowerCase()) === 0)
                        {
                                      
                            Object.assign(value,{search_name:`${value.generic_name} (${value.name})`})
                            ar.push(value);
                            return ar;
                        }    
                                
                         
                        for(let i = 0 ; i < lenght_of_the_prescription_to_search; i++)
                        {
                            if(v[i] !== prescription.toLowerCase()[i])
                                    it_matches = false;
                        } 
                           
                         if(it_matches)
                         {
                           
                            Object.assign(value,{search_name:`${value.name} (${value.generic_name})`})
                            ar.push(value);
                            
                         }
                         it_matches = true;
                         let g = value.generic_name.toLowerCase();
                         for(let i = 0 ; i < lenght_of_the_prescription_to_search; i++)
                         {
                            if(g[i] !== prescription.toLowerCase()[i])
                                    it_matches = false;
                         }
                         if(it_matches)
                         {
                            Object.assign(value,{search_name:`${value.generic_name} (${value.name})`})
                            ar.push(value);
                            
                         }
                         

                });                 
             
             return ar;
            }
            
         });
    }
})
export default Mutation;