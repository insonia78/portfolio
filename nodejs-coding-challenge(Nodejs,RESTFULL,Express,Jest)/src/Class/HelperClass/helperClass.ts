import { User } from "../../interfaces/user.interface";
import  {transports, createLogger, format}  from 'winston';
const logConfiguration = {
            'format': format.combine(
                format.timestamp(),
                format.json()
            ),
             transports:[
                 new transports.File({
                     filename:'./logs/logs.log'
                 })
             ] 
};
const logger = createLogger(logConfiguration);
export class HelperClass{


    static isEmpty(value:any)
    {
        return (!value || 0 === value.length || /^\s*$/.test(value));
    }
    static sortUserAscEmailArray(array:Array<User>)
    {
        return array.sort((n1,n2)=>{
                 if(n1.email > n2.email)
                     return 1;
                 if(n1.email < n2.email)
                     return -1;
                 return 0;

        });
    }
    static sortUserDescEmailArray(array:Array<User>)
    {
        return array.sort((n1,n2)=>{
                 if(n1.email < n2.email)
                     return 1;
                 if(n1.email > n2.email)
                     return -1;
                 return 0;

        });
    }
    static sortUserAscNameArray(array:Array<User>)
    {
        return array.sort((n1,n2)=>{
                 if(n1.name > n2.name)
                     return 1;
                 if(n1.name < n2.name)
                     return -1;
                 return 0;

        });
    }
    static sortUserDescNameArray(array:Array<User>)
    {
        return array.sort((n1,n2)=>{
                 if(n1.name < n2.name)
                     return 1;
                 if(n1.name > n2.name)
                     return -1;
                 return 0;
        });
    }

    static validateEmail(email:string) {
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email)
      }
    static LoggerInfo(value:string)
    {
         logger.info(value);
    }
    static LoggerError(value:string)
    {
         logger.error(value);
    }
}