import path from 'path';
import fs from 'fs';


 class  WriteToLogBaseClass{
      private file:string;
      private iterationTimes = 0;
      private setTimeOutReference:any;
      private serviceName:string;

     constructor(filename:string,serviceName:string){
           this.file = `${process.cwd()}/${filename}`;
           this.serviceName = serviceName
     }

      public writeToLog(value:any){
      let time =  new Date().toISOString();
      fs.appendFile(this.file, `${time}:${this.serviceName} ${value}`, (err) => {
            if (err){

                  if(this.iterationTimes++ > 5)
                  {
                       clearTimeout(this.setTimeOutReference);
                       this.iterationTimes = 0;
                       console.log(`${time}:${this.serviceName} can't write to log ${err}`);
                       // to be handled when finished writting nats bus 
                  }else
                  {
                     this.setTimeOutReference = setTimeout(this.writeToLog,1000,value);                         
                  }
                    
            };
            console.log(`${time}:${this.serviceName} The  was appended to log!`);
            this.iterationTimes = 0;  
          }); 

     }
     public getServiceName(){
           return this.serviceName;
     }
      
}

export { WriteToLogBaseClass}