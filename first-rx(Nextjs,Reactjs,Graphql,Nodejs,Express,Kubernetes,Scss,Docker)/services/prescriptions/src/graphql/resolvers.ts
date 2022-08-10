//const request = require('postman-request');
const request = require('request');
const crypto = require('crypto');
const DOMParser = require("xmldom").DOMParser;
const convert = require('xml-js');
import { writeToLog } from './../../src/helper/writeToLog';
const soap = require('soap');
const fs = require('fs');
import path from 'path';
import e from 'express';
//const soap = require('strong-soap').soap;
const soapRequest = require('easy-soap-request');
const moment = require('moment')

let private_key: string;

// fs.readFile(path.join(process.cwd(), "firstrx.key"), (err: any, data: any) => {
//     private_key = data;

// });

let public_key: string;

// fs.readFile('firstrx.crt', (err: any, data: any) => {
//     if (err) {
//         console.error(err)
//         return
//     }
//     public_key = data;
// });


module.exports = {
    Mutation: {
        prescription: async (parent: any, args: any, context: any, info: any) => {
            let prescription = args.prescription.trim();

            const xmlSampleResponse = `
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soap:Body>
      <findDrugByNameResponse xmlns="http://rx-savings.medimpact.com/contract/PricingEngine/v1.0">
         <drugNames>
            <drugNameSuggestion>BENACTYZINE HCL (BULK)</drugNameSuggestion>
            <drugNameSuggestion>BENADRYL</drugNameSuggestion>
            <drugNameSuggestion>BENADRYL ALLERGY</drugNameSuggestion>
            <drugNameSuggestion>BENADRYL EXTRA STRENGTH</drugNameSuggestion>
            <drugNameSuggestion>BENADRYL ITCH COOLING</drugNameSuggestion>
            <drugNameSuggestion>BENADRYL ITCH RELIEF STICK</drugNameSuggestion>
            <drugNameSuggestion>BENADRYL ITCH STOPPING</drugNameSuggestion>
            <drugNameSuggestion>BENAZEPRIL</drugNameSuggestion>
            <drugNameSuggestion>BENAZEPRIL HCL (BULK)</drugNameSuggestion>
            <drugNameSuggestion>BENAZEPRIL-HYDROCHLOROTHIAZIDE</drugNameSuggestion>
         </drugNames>
      </findDrugByNameResponse>
   </soap:Body>
</soap:Envelope>`;
            try{

            let toJson = convert.xml2json(xmlSampleResponse, { compact: true, spaces: 4 });
            toJson = JSON.parse(toJson);
            
            let data = toJson["soap:Envelope"]['soap:Body']["findDrugByNameResponse"]["drugNames"]["drugNameSuggestion"];
            
            for (let i = 0; i < data.length; i++) {
                
                if (data[i]._text === prescription)
                {  
                    let a = { code: 200, message: '', prescriptions: [data[i]] };
                    console.log('a',a);                  
                    return  a ;
                }
            }
            let b = { code: 200, message: '', prescriptions: data }; 
            return { code: 200, message: '', prescriptions: data } ;
        }catch(e){
            console.log(e.message);
        }
            if (prescription.length < 3) {
                console.log(`code:422, message:"Request is not valid`);
                return { code: 422, message: "Request is not valid" }
            }
            return await new Promise((resolve, reject) => {

                try {
                    let envVariables: string = process.env.APIKEYS === undefined ? "" : process.env.APIKEYS.toString();
                    let obj = JSON.parse(envVariables);
                    const signer = crypto.createSign('RSA-SHA256');

                    var myTimeStamp = moment().utcOffset('-0700').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');

                    const query = (Temp: any) => {

                        signer.write(myTimeStamp);
                        signer.end();
                        const signature = signer.sign(private_key, 'base64');
                        let xml = `
                        <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" 
                        xmlns:v1=\"http://rx-savings.medimpact.com/contract/PricingEngine/v1.0\">
                        <soapenv:Header/>
                        <soapenv:Body>
                            <v1:findDrugByNameRequest>
                                <v1:clientAccountCode>${process.env.MEDIMPACT_CLIENT_CODE}</v1:clientAccountCode>
                                <v1:token>${obj["medimpact-token"]}</v1:token>
                                <v1:timestamp>${myTimeStamp}</v1:timestamp>
                                <v1:prefixText>${Temp}</v1:prefixText>
                                <!--Optional:-->
                                <v1:count>10</v1:count>
                            </v1:findDrugByNameRequest>
                        </soapenv:Body>
                    </soapenv:Envelope>`;


                        const verify = crypto.createVerify('RSA-SHA256');

                        verify.write(myTimeStamp);
                        verify.end();

                        console.log("--verification-->>>>>>>>>>>>", verify.verify(public_key, signature, 'base64'));

                        console.log(xml);

                        let options = {
                            method: "POST",
                            url: `${process.env.MEDIMPACT_URL}`,
                            headers: {
                                'Content-Type': 'text/xml',
                                'CC-Timestamp-Signature': signature
                            },
                            body: xml
                        };
                        request(options, function (error: any, response: any) {
                            if (error) {
                                console.log(error);
                                reject(new Error(error)); // reject instead of throwing, handle with `catch`
                                return;
                            }
                            console.log('body1', response.body, 'statusCode', response.statusCode);
                            if (response.statusCode === 200 && response.body !== '') {
                                let xml = response.body;
                                let toJson = convert.xml2json(xml, { compact: true, spaces: 4 });
                                toJson = JSON.parse(toJson);
                                let data = toJson["soap:Envelope"]['soap:Body']["findDrugByNameResponse"]["drugNames"]["drugNameSuggestion"];

                                if (data.length > 0)
                                    resolve({ code: response.statusCode, message: '', prescriptions: Array.isArray(data) ? data : [data]});
                                else
                                    resolve({ code: 204, message: `No Data for ${toJson}`, prescriptions: [] });



                            }
                            else {
                                resolve({ code: 204, message: `No Data for ${args.prescription}`, prescriptions: [] });
                            }
                        });


                    }

                    query(prescription);


                } catch (e) {
                    console.log("error message" + e.message);
                    // console.log(`${writeToLog.getServiceName()} =${e.message}`);
                    // writeToLog.writeToLog(`code:500, error:'Internal Server Error' messase:${e.message}`);
                    resolve({ code: '500', error: 'Internal Server Error', message: e.message });
                }

            }).then((response) => { console.log('inside response', response); return response; });

        }

    },
    Query: {
        hello: () => "Hello world",
    }
}
