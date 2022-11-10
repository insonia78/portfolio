import { stringArg, queryType, extendType, arg, intArg } from "@nexus/schema";
import Employee from "./Employee";
import Payload from './Payload';
import { data } from "../data";
import { EmployeeInterface } from "../interfaces/employee.interface";
import { sortAndDeduplicateDiagnostics } from "typescript";


const Sort = (sort,array) =>{

    let ar = [];
    
    if(sort.localeCompare('first_name') === 0)
    {
         array.sort((a,b) => a.first_name.localeCompare(b.first_name)  )
            
    }
    else if(sort.localeCompare('last_name') === 0)
    {
        array.sort((a,b) => a.last_name.localeCompare(b.last_name)  )     
    }
    else if(sort.localeCompare('age') === 0)
    {
        array.sort((a,b) => parseInt(a.age) - parseInt(b.age)  )
    }
    else if(sort.localeCompare('email') === 0)
    {
        array.sort((a,b) => a.email.localeCompare(b.email)  )
    }
    else if(sort.localeCompare('title') === 0)
    {
        array.sort((a,b) => a.title.localeCompare(b.title)  ) 
    }
    else if(sort.localeCompare('start_date') === 0)
    {
       
       array.sort((a,b) => b.start_date.split("-").reverse().join("").localeCompare(a.start_date.split("-").reverse().join("")))
       
       
      
    }
    else
    {
        array.sort((a,b) => parseInt(a.id) - parseInt(b.id)  )
    }  

    return {code:200,message:array};
}
const FilterByAge = (to,from,array) =>{
    let ar = [];
    array.sort((a,b) => parseInt(a.age) - parseInt(b.age)   )
    to = parseInt(to);
    from = parseInt(from);  
    return{ code:200, message:array.filter(element => element.age >= to && element.age <= from )};
}


const SearchEmployer = (name , data) =>{
    let ar:EmployeeInterface[] = [];
               
    try {                    
        
        let lenght_of_the_name_to_search = name.trim().length;
        let it_matches = true;
            
            data.forEach((value) => {                        
                let first_name = value.first_name.toLowerCase();
                let last_name = value.last_name.toLowerCase();
                let v=`${value.first_name} , ${(value.middle_name !== '' ? (value.middle_name + ',') : "")} ${value.last_name}, ${value.title}, ${value.age}`;
                
                if ((v.localeCompare(name) === 0)) {
                     ar.push(value);                             
                     return {code:200, message:ar};
                }
                
                if ((first_name.localeCompare(name.toLowerCase()) === 0) && value.first_name.length === name.length) {
                    ar.push(value);
    
                }
    
                if (last_name.localeCompare(name.toLowerCase()) === 0 && value.last_name.length === name.length) {
                    ar.push(value);
    
                }
    
                 
                for (let i = 0; i < lenght_of_the_name_to_search && (value.first_name.length > name.length || value.first_name.length < name.length); i++) {
                    if (first_name[i] !== name.toLowerCase()[i]) {
                        it_matches = false;
                        break;
                    }
                    if (first_name[i] === name.toLowerCase()[i]) {
                        it_matches = true;
                    }
                    
                }
    
                if (it_matches && (value.first_name.length > name.length || value.first_name.length < name.length)) {
                    ar.push(value);
                    
                }
                it_matches = true;
    
                for (let i = 0; i < lenght_of_the_name_to_search && (value.last_name.length > name.length || value.last_name.length < name.length); i++) {
                   
                    if (last_name[i] !== name.toLowerCase()[i]) {
                        it_matches = false;
                        break;
                    }
                    if (last_name[i] === name.toLowerCase()[i]) {
                        it_matches = true;
                    }
                }
    
                if (it_matches && (value.last_name.length > name.length || value.last_name.length < name.length)) {
                    ar.push(value);
                }
    
    
            });

        
       
    }
    catch (e) {
        console.log(e);
        return {code:500, message:e};
    }
    return {code:200, message:ar};
   

}

const Mutation = extendType({
    type: 'Mutation',
    
    definition(t) {
        t.field('filterEmployeeByAge', {
            type: Payload,
            args: { to: stringArg(),from:stringArg(),sort:stringArg(),name:stringArg()},
            resolve: (root,args, ctx) => {

                let _data = FilterByAge(args.to,args.from, data.employees);
                  
                if(args.sort.localeCompare('choose_sort') === 0 && args.name.localeCompare('') === 0)
                    return _data;
                
                if(!(args.name.localeCompare('') === 0))
                   _data = SearchEmployer(args.name,_data.message)
                            
                return  Sort(args.sort,_data.message);                   

            }
        }),
        t.field('sortEmployeeBy', {
            type: Payload,
            args: { sort: stringArg(),to:stringArg(),from:stringArg(),name:stringArg()},
            resolve: (root, args, ctx) => {
                let ar = [];
                let _data ;
                if(isNaN(parseInt(args.to)) && args.name.localeCompare('') === 0)
                   return  Sort(args.sort,data.employees);
                
                if(!(args.name.localeCompare('') === 0))
                   _data = SearchEmployer(args.name,data.employees)
                
                if(!isNaN(parseInt(args.to)))   
                   _data = FilterByAge(args.to,args.from,(_data?_data.message:data.employees));

                return  Sort(args.sort,(_data?_data.message:data.employees));
                
            }
        }),
        t.field('getAllEmployees',{
            type: Payload,
            resolve:() => Sort('',data.employees),
        }),
        t.field("searchEmployer", {
            type: Payload,
            args: { name: stringArg(),to:stringArg(),from:stringArg(),sort:stringArg()},
            resolve: (root,args, ctx)=>{             
                let response ;
                if(!isNaN(parseInt(args.to)))
                {
                   response = FilterByAge(args.to,args.from, data.employees);  
                   response = Sort(args.sort,response.message);
                   return SearchEmployer(args.name,response.message);

                }

                response = Sort(args.sort,data.employees);
                return SearchEmployer(args.name,response.message);        
                
            }

        });
    }
})


export default Mutation;