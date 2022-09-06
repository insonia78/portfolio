const data = require('./data');

const andOrOr = (value) => {

    return (value === 'all' ? 'OR' : 'AND');
}
let dynamicQuery = [] ;
dynamicQuery.push("Where( ");
let helperQuery = [];
const creatingTheDynamicClause = (array, parentKey,number,parentIdType) => {
     
    array.forEach((element,i) => {
       
        
        let keys = Object.keys(element);
        
        keys.forEach((key,ind) =>{
              
            if (element[key] === 'all') {
                
            }
            else if (Array.isArray(element[key])) {
                
                creatingTheDynamicClause(element[key],key,++number,element['id']); 
                
    
            }
            else{
               
                
                helperQuery.push(`v.${parentKey}=${isNaN(element[key])?`'${element[key]}'`:element[key] }`);
                if(helperQuery.length > 2)
                {
                  let secondElement = helperQuery[helperQuery.length - 1].split("=");
                  let firstElement = helperQuery[helperQuery.length - 3].split("=");
                  
                  if(secondElement[0] === firstElement[0] && parentIdType === 'all')
                  {
                      helperQuery[helperQuery.length - 2] = 'OR';
                      helperQuery.push('OR');
                      
                      
                  }
                  else if(secondElement[0] !== firstElement[0] && parentIdType === 'all')
                  {
                     helperQuery[helperQuery.length - 2] = 'AND';
                     helperQuery.push('AND');
                  }
                  else if(secondElement[0] !== firstElement[0] && parentIdType !== 'all')
                  {
                     helperQuery[helperQuery.length - 2] = 'AND';
                     helperQuery.push('AND');
                  }
                  
                }
                else
                {
                  helperQuery.push('AND');
                  
                }
                 
               
                 
            }
        })
       
        
    })
   
    if(--number === 1)
    {
        helperQuery.forEach(element => dynamicQuery.push(element));
        helperQuery.splice(0,helperQuery.length);
        if(dynamicQuery[dynamicQuery.length - 1] === 'AND' || dynamicQuery[dynamicQuery.length - 1] === 'AND' )
        {
           dynamicQuery[dynamicQuery.length - 1] = ')';
        }
        else
           dynamicQuery.push(')');
           dynamicQuery.push('OR(');  
    }
       
    
}





let keys = Object.keys(data);

keys.forEach((key) => {

    if (Array.isArray(data[key])) {
        
        creatingTheDynamicClause(data[key], key,0,data['id'])

    }
    dynamicQuery[dynamicQuery.length - 1 ] =";";
    console.log(dynamicQuery.join(" ")); 
});


