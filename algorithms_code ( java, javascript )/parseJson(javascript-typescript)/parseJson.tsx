// Create an interface employee with first name, last name and reportees
// Create implementation of that and then fill the data 
// After that create 2 employee and iterrate and print iterrate

interface Employee {
    firstName :string,
    lastName:string ,
    reportees:string
   
 }
 
 
 const populateData = (data:any|Employee)=>{
 
     Object.keys(data)
     .forEach( (e:any,i:number) =>{
 
       console.log(e,"=", data[e]);
 
 
 })
 }
 
 let person1:Employee = {
   firstName:"T",
   lastName:"Z",
   reportees:"1,2,3"
 };
 
 let person2:Employee = {
   firstName:"A",
   lastName:"T",
   reportees:"3,4,5"
 };
 
 const array = [person1,person2]
  array.forEach(e => {
   populateData(e);
   
  });
 
 
 