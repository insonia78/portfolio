import { WriteToLogBaseClass } from 'first-rx-common-lib';
const json_p  = require('./../../package.json');


class writeToLogClass extends WriteToLogBaseClass.WriteToLogBaseClass {

            constructor(fileName:string,serviceName:string){
                  super(fileName,serviceName)
                
            }
            // public writeToLog(value:string)
            // {
            //           super.writeToLog(value);
            // }
            // public getServiceName(){
                   
            //     return super.getServiceName();
            // }
}

const writeToLog  = new writeToLogClass('log',json_p.name);
export {writeToLog }