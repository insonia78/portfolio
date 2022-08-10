const request = require('postman-request');
import { response } from 'express';
import  {writeToLog}  from './../../src/helper/writeToLog';


//https://developers.google.com/maps/documentation/geocoding/overview#ReverseGeocoding
//https://developers.google.com/places/web-service/autocomplete#location_biasing


module.exports = {
    Mutation: {
        GetLocationFromZipOrCity: async (parent: any, args: any, context: any, info: any) => {
            let envVariables = process.env.APIKEYS;
            let obj = JSON.parse(JSON.stringify(envVariables));
            
            const getAddressByGeoLocation = (bodyfromplaces:any,place_id:string,resolve:any)=>{
              
                let url=process.env.GOOGLE_GEOCODE_URL;  
                url +='?'
                url += 'place_id=';
                url += place_id;
                url +=  `&key=${obj['google-key']}`;

                request(url, (error: any, response: any, body: any) => {
                    if (error)
                    {
                        writeToLog.writeToLog(`code:500, error:InternalServerError message:${error}`);                        
                        resolve({ code: '500', 
                                  error: 'Internal Server Error', 
                                  message: 'Something went wrong' }
                                  );

                    }    
                    else {
                        let b;

                        if(Object.keys(body).length !== 0)
                        {                                        

                            body = JSON.parse(body);
                            if (body.error !== undefined) {
                                Object.assign(body, { code: 400, message: body.error });
                            }
                            else {
                                Object.assign(body, { code: 200 });
                            }
                            

                        }
                        else{
                          b = new Error("there is an error");                                      
                        }
                       
                        resolve(body);
                    }

                });

             }  


            return await new Promise((resolve, reject) => {
                

                try {
                    const value = args.value;

                    //if(!(value.match(/[~`!#$%@\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g) !== null || !(value.match(/[A-Za-z]/) === null || value.match(/[0-9]/) === null )))



                    let url = process.env.GOOGLE_PLACE_URL;   //process.env.CITY_AUTO_COMPLETE;

                    url += '?';
                    url += `input=${value}`;
                    url += '&types=(regions)';
                    url += '&components=country:us';
                    url += '&radius=500';
                    url +=  `&key=${obj['google-key']}`;   //`&key=${process.env.GOOGLE_API_MAPS_KEY}`;
                    request(url, (error: any, response: any, body: any) => {
                        if (error) {
                            console.log(`${writeToLog.getServiceName()} = ${error}`);
                            writeToLog.writeToLog(`code:500, error:InternalServerError, message:${error}`);
                            resolve({ code: '500', error: 'Internal Server Error', message: 'Something went wrong' });

                        }
                        else {


                            if (Object.keys(body = JSON.parse(body)).length !== 0 || body['predictions'].length > 0) {
                                // console.log(body);
                                // console.log('inside predictions',body['predictions']);
                                // console.log('inside predictions1',body.predictions);
                                // console.log('inside predictions1',body.predictions.length);
                                if (body['predictions'].length === 1) {                                    
                                    getAddressByGeoLocation(body,body.predictions[0].place_id,resolve)    
                                }
                                else {

                                    if (body.error !== undefined) {
                                        console.log(`${writeToLog.getServiceName()} = ${body.error}`);
                                        writeToLog.writeToLog(`code:400, error:InternalServerError, message:${body.error}`);
                                        Object.assign(body, { code: 400, message: body.error });
                                    }
                                    else {
                                        Object.assign(body, { code: 200 });
                                    }
                                    resolve(body);
                                }
                                

                            }
                            else {
                                console.log(`${writeToLog.getServiceName()} = Returned no response`);
                                writeToLog.writeToLog(`code:400, message: ${url} returned no response`);
                                resolve({ code: 400, message: 'Returned no response' });
                            }

                        }

                    });
                    // }
                    // else{
                    //     resolve({code:'404',error:'Not Found',message:'Value not found'});
                    // }




                }
                catch (e) {
                    console.log(`${writeToLog.getServiceName()} =${e.message}`);
                    writeToLog.writeToLog(`code:500, error:'Internal Server Error' messase:${e.message}`);
                    resolve({ code: '500', error: 'Internal Server Error', message: e.message });
                }

            }).then((response) => { console.log('inside response', response); return response; });

        }

    },
    Query: {
        hello: () => "Hello world",
    }
}
