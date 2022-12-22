import * as apiUsage from './../../mockData/api-usage.json';


export const splitDecimals = ( value:string ) => {
      
        if(value === undefined)
             return "";
       const array:string[] =   value.split("").reverse();

        let result = "";   
        for(let i = 0; i < array.length; i++)
        {
              
            if( i === array.length - 1)
                result += array[i];
            else if( (i + 1) % 3 === 0 && !isNaN(parseInt(array[i])))
                result += array[i]+"  "
            else 
                result += array[i]; 
        }
        return result.split("").reverse().join("");       
           
}

export const asteristcs = ( value:string, asteriscs:number ) =>{
          if(value === undefined)
             return "";
          const array:string[] = value.split("").reverse();
          let a = "";
          for(let i = 0 ; i < asteriscs;i++)
          {
            a += "*";
          }
          return `${a}${array.slice(0 , 5 ).reverse().join("")}`;
}
export const calculatePercentage = ( current:string, past:string) => {
        if(current === undefined)
           return ""; 
        let a:number = parseInt(current);
        let b:number = parseInt(past);
        let result:number = a - b; 
           
        if( result > 0)
            return `+${((1 - (b/a)) * 100).toFixed(2)}`;
        if( result < 0)
            return `-${((1 - (a/b)) * 100).toFixed(2).toString()}`;
        
         return "0";   
}