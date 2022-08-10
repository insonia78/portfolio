//const request = require('postman-request');
const request = require('request');
const crypto = require('crypto');

import { writeToLog } from './../../src/helper/writeToLog';
import path from 'path';
import { xml2json } from 'xml-js';
const convert = require('xml-js');
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
        coupon: async (parent: any, args: any, context: any, info: any) => {
           let prescription = args.prescription.trim();
           let latitude = args.latitude.trim();
           let longitude = args.longitude.trim();


            const xmlSampleResponse = `
             <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soap:Body>
      <getPharmacyDrugPricingResponse xmlns="http://rx-savings.medimpact.com/contract/PricingEngine/v1.0">
         <drugInfo/>
         <drugs>
            <locatedDrug>
               <pharmacy>
                  <name>SUBURBAN PHARMACY</name>
                  <streetAddress>10875 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-0000</zipCode>
                  <latitude>40.109914</latitude>
                  <longitude>-75.025198</longitude>
                  <hoursOfOperation>10915209193091940919509196091970917</hoursOfOperation>
                  <phone>2156730994</phone>
                  <npi>1962560565</npi>
                  <distance>0.92</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>321.58</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>321.58</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>JJ PHARMACY</name>
                  <streetAddress>728 RED LION RD</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19115-0000</zipCode>
                  <latitude>40.105626</latitude>
                  <longitude>-75.03381</longitude>
                  <hoursOfOperation>1    20917309174091750917609177</hoursOfOperation>
                  <phone>2156988080</phone>
                  <npi>1750661914</npi>
                  <distance>1.4</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>321.58</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>321.58</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>EINSTEIN AT CENTER ONE PHARMACY</name>
                  <streetAddress>9880 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19115-2185</zipCode>
                  <latitude>40.095704</latitude>
                  <longitude>-75.030587</longitude>
                  <hoursOfOperation>1    20841308414084150841608417</hoursOfOperation>
                  <phone>2158271680</phone>
                  <npi>1891010229</npi>
                  <distance>1.93</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>321.58</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>321.58</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>FIRXST PHARMACY</name>
                  <streetAddress>12043 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-2107</zipCode>
                  <latitude>40.122669</latitude>
                  <longitude>-75.015851</longitude>
                  <hoursOfOperation>1    208193081940819508196081971016</hoursOfOperation>
                  <phone>2156138065</phone>
                  <npi>1952611709</npi>
                  <distance>0.12</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>335.01</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>335.01</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>A PLUS PHARMACY</name>
                  <streetAddress>13023 BUSTLETON AVE STE 1C</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-1672</zipCode>
                  <latitude>40.123675</latitude>
                  <longitude>-75.015354</longitude>
                  <hoursOfOperation>1    209193091940919509196091971014</hoursOfOperation>
                  <phone>2677316163</phone>
                  <npi>1760778740</npi>
                  <distance>0.18</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>335.01</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>335.01</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>HENDRIX PHARMACY</name>
                  <streetAddress>11685 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-2542</zipCode>
                  <latitude>40.118583</latitude>
                  <longitude>-75.018212</longitude>
                  <hoursOfOperation>1    234193341943419534196341971015</hoursOfOperation>
                  <phone>2159693900</phone>
                  <npi>1790076610</npi>
                  <distance>0.24</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>335.01</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>335.01</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>SHOPRITE PHARMACY</name>
                  <streetAddress>11000 ROOSEVELT BOULEVARD</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-0000</zipCode>
                  <latitude>40.101016</latitude>
                  <longitude>-75.007492</longitude>
                  <hoursOfOperation>10915208213082140821508216082170918</hoursOfOperation>
                  <phone>2156731210</phone>
                  <npi>1861507642</npi>
                  <chainCode>894</chainCode>
                  <distance>1.55</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>335.01</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>335.01</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>TRANSITION PHARMACY</name>
                  <streetAddress>2540 METROPOLITAN DR SUITE 2546</streetAddress>
                  <city>TREVOSE</city>
                  <state>PA</state>
                  <zipCode>19053-0000</zipCode>
                  <latitude>40.13255</latitude>
                  <longitude>-74.984513</longitude>
                  <hoursOfOperation>1    209203092040920509206092070913</hoursOfOperation>
                  <phone>2156396162</phone>
                  <npi>1336325265</npi>
                  <distance>1.91</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>335.01</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>335.01</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>NEW CARE PHARMACY</name>
                  <streetAddress>711 BUSTLETON PK</streetAddress>
                  <city>FEASTERVILLE</city>
                  <state>PA</state>
                  <zipCode>19053-0000</zipCode>
                  <latitude>40.147816</latitude>
                  <longitude>-75.003695</longitude>
                  <hoursOfOperation>1    209203092040920509206092070916</hoursOfOperation>
                  <phone>2153577737</phone>
                  <npi>1841330396</npi>
                  <distance>1.93</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>335.01</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>335.01</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>CVS PHARMACY</name>
                  <streetAddress>10901C BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-0000</zipCode>
                  <latitude>40.112557</latitude>
                  <longitude>-75.023373</longitude>
                  <hoursOfOperation>10917208213082140821508216082170918</hoursOfOperation>
                  <phone>2156772122</phone>
                  <npi>1770687519</npi>
                  <chainCode>039</chainCode>
                  <distance>0.71</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>342.78</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>377.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>342.78</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>CVS PHARMACY</name>
                  <streetAddress>15500 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-0000</zipCode>
                  <latitude>40.134222</latitude>
                  <longitude>-75.009293</longitude>
                  <hoursOfOperation>10917208213082140821508216082170918</hoursOfOperation>
                  <phone>2156778593</phone>
                  <npi>1821192600</npi>
                  <chainCode>039</chainCode>
                  <distance>0.96</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>342.78</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>377.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>342.78</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>CVS PHARMACY #</name>
                  <streetAddress>11000 ROOSEVELT BLVD STE 3</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-0000</zipCode>
                  <latitude>40.101016</latitude>
                  <longitude>-75.007492</longitude>
                  <hoursOfOperation>11117209193091940919509196091970917</hoursOfOperation>
                  <phone>2153050001</phone>
                  <npi>1518989243</npi>
                  <chainCode>207</chainCode>
                  <distance>1.55</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>342.78</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>377.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>342.78</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>CVS PHARMACY</name>
                  <streetAddress>298 E ST RD</streetAddress>
                  <city>FEASTERVILLE</city>
                  <state>PA</state>
                  <zipCode>19053-0000</zipCode>
                  <latitude>40.146554</latitude>
                  <longitude>-74.99523</longitude>
                  <hoursOfOperation>10917208213082140821508216082170918</hoursOfOperation>
                  <phone>2159425141</phone>
                  <npi>1720182504</npi>
                  <chainCode>039</chainCode>
                  <distance>2.08</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>342.78</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>377.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>342.78</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>CVS PHARMACY</name>
                  <streetAddress>9875 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19115-0000</zipCode>
                  <latitude>40.093199</latitude>
                  <longitude>-75.031447</longitude>
                  <hoursOfOperation>10917208213082140821508216082170918</hoursOfOperation>
                  <phone>2159698750</phone>
                  <npi>1780788521</npi>
                  <chainCode>039</chainCode>
                  <distance>2.11</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>342.78</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>377.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>342.78</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>WALGREENS #1255</name>
                  <streetAddress>12050 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-0000</zipCode>
                  <latitude>40.123156</latitude>
                  <longitude>-75.01559</longitude>
                  <hoursOfOperation>11018209213092140921509216092170918</hoursOfOperation>
                  <phone>2156730937</phone>
                  <npi>1992711394</npi>
                  <chainCode>226</chainCode>
                  <distance>0.15</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>343.55</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>377.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>343.55</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>WALGREENS</name>
                  <streetAddress>10000 BUSTLETON AVE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-0000</zipCode>
                  <latitude>40.103109</latitude>
                  <longitude>-75.02864</longitude>
                  <hoursOfOperation>11018209213092140921509216092170918</hoursOfOperation>
                  <phone>2156981878</phone>
                  <npi>1134134026</npi>
                  <chainCode>226</chainCode>
                  <distance>1.42</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>343.55</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>377.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>343.55</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>SAVON PHARMACY</name>
                  <streetAddress>920 RED LION RD</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19115-0000</zipCode>
                  <latitude>40.101197</latitude>
                  <longitude>-75.025768</longitude>
                  <hoursOfOperation>10917209213092140921509216092170919</hoursOfOperation>
                  <phone>2156766279</phone>
                  <npi>1851347850</npi>
                  <chainCode>156</chainCode>
                  <distance>1.49</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>346.28</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>346.28</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>SAVON PHARMACY</name>
                  <streetAddress>105 E ST RD</streetAddress>
                  <city>FEASTERVILLE</city>
                  <state>PA</state>
                  <zipCode>19053-0000</zipCode>
                  <latitude>40.148286</latitude>
                  <longitude>-74.998358</longitude>
                  <hoursOfOperation>10917209213092140921509216092170919</hoursOfOperation>
                  <phone>2159424894</phone>
                  <npi>1942256946</npi>
                  <chainCode>156</chainCode>
                  <distance>2.09</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>346.28</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>99999</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>346.28</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>RITE AID PHARMACY 00852</name>
                  <streetAddress>11750 BUSTLETON AVENUE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19116-2516</zipCode>
                  <latitude>40.119977</latitude>
                  <longitude>-75.017379</longitude>
                  <hoursOfOperation>11018208223082240822508226082270918</hoursOfOperation>
                  <phone>2159346221</phone>
                  <npi>1114016854</npi>
                  <chainCode>181</chainCode>
                  <distance>0.14</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>346.32</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>414.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>346.32</awpPrice>
               </pricing>
            </locatedDrug>
            <locatedDrug>
               <pharmacy>
                  <name>RITE AID PHARMACY 04988</name>
                  <streetAddress>9920 BUSTLETON AVENUE</streetAddress>
                  <city>PHILADELPHIA</city>
                  <state>PA</state>
                  <zipCode>19115-2149</zipCode>
                  <latitude>40.100858</latitude>
                  <longitude>-75.029653</longitude>
                  <hoursOfOperation>11018208223082240822508226082270918</hoursOfOperation>
                  <phone>2154641177</phone>
                  <npi>1942390968</npi>
                  <chainCode>181</chainCode>
                  <distance>1.58</distance>
               </pharmacy>
               <drug>
                  <ndcCode>65597020330</ndcCode>
                  <brandGenericIndicator>B</brandGenericIndicator>
                  <gsn>73295</gsn>
                  <drugRanking>1</drugRanking>
                  <quantity>30.0</quantity>
                  <quantityRanking>1</quantityRanking>
               </drug>
               <pricing>
                  <price>346.32</price>
                  <priceBasis>AWP</priceBasis>
                  <usualAndCustomaryPrice>414.99</usualAndCustomaryPrice>
                  <macPrice>99999</macPrice>
                  <awpPrice>346.32</awpPrice>
               </pricing>
            </locatedDrug>
         </drugs>
         <forms>
            <locatedDrugForm>
               <form>TABLET</form>
               <gsn>73295</gsn>
               <isSelected>true</isSelected>
               <ranking>1</ranking>
            </locatedDrugForm>
         </forms>
         <names>
            <locatedDrugName>
               <drugName>SAVAYSA</drugName>
               <brandGenericIndicator>B</brandGenericIndicator>
               <isSelected>true</isSelected>
            </locatedDrugName>
         </names>
         <quantities>
            <locatedDrugQty>
               <quantity>30.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>true</isSelected>
               <ranking>1</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>90.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>2</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>19.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>3</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>27.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>3</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>4.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>3</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>60.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>3</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>15.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>4</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>23.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>4</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>5.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>4</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>20.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>5</ranking>
            </locatedDrugQty>
            <locatedDrugQty>
               <quantity>45.0</quantity>
               <quantityUom>TABLET</quantityUom>
               <gsn>73295</gsn>
               <isSelected>false</isSelected>
               <ranking>5</ranking>
            </locatedDrugQty>
         </quantities>
         <strengths>
            <locatedDrugStrength>
               <strength>60 mg</strength>
               <gsn>73295</gsn>
               <isSelected>true</isSelected>
               <ranking>1</ranking>
            </locatedDrugStrength>
            <locatedDrugStrength>
               <strength>30 mg</strength>
               <gsn>73294</gsn>
               <isSelected>false</isSelected>
               <ranking>2</ranking>
            </locatedDrugStrength>
            <locatedDrugStrength>
               <strength>15 mg</strength>
               <gsn>73293</gsn>
               <isSelected>false</isSelected>
               <ranking>3</ranking>
            </locatedDrugStrength>
         </strengths>
      </getPharmacyDrugPricingResponse>
   </soap:Body>
</soap:Envelope>`;

            
             let toJson = convert.xml2json(xmlSampleResponse, {compact: true, spaces: 4});
             toJson = JSON.parse(toJson);
             let data =  toJson["soap:Envelope"]["soap:Body"]["getPharmacyDrugPricingResponse"];
              console.log(data); 
             return{ code: 200, message: ``, coupons:data };
            return await new Promise((resolve, reject) => {

                try {
                    let envVariables: string = process.env.APIKEYS === undefined ? "" : process.env.APIKEYS.toString();
                    let obj = JSON.parse(envVariables);
                    const signer = crypto.createSign('RSA-SHA256');

                    var myTimeStamp = moment().utcOffset('-0700').format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');






                    const query = (Temp: any, elementToParse: any) => {



                        signer.write(myTimeStamp);
                        signer.end();
                        const signature = signer.sign(private_key, 'base64');
                        let xml = `
                        <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" 
                        xmlns:v1=\"http://rx-savings.medimpact.com/contract/PricingEngine/v1.0\">
                        <soapenv:Header/>
                        <soapenv:Body>
                            <v1:getPharmacyDrugPricingRequest>
                                <v1:clientAccountCode>${process.env.MEDIMPACT_CLIENT_CODE}</v1:clientAccountCode>
                                <v1:token>${obj["medimpact-token"]}</v1:token>
                                <v1:timestamp>${myTimeStamp}</v1:timestamp>
                                <v1:pharmacyCriteria>
                                <v1:locationCriteria>
                                    <v1:latitude>${latitude}</v1:latitude>
                                   <v1:longitude>${longitude}</v1:longitude>
                                </v1:locationCriteria>
                             </v1:pharmacyCriteria>
                             <v1:drugCriteria>
                                <!--You have a CHOICE of the next 3 items at this level-->
                                <v1:drugName>${prescription}</v1:drugName>
                             </v1:drugCriteria>
                            </v1:getPharmacyDrugPricingRequest>
                    
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
                            
                            if (response.statusCode === 200 && response.body !== '') {
                                
                              try{
                                let xml = response.body;
                                let toJson = convert.xml2json(xml, {compact: true, spaces: 4});
                                toJson = JSON.parse(toJson);
                                let data =  toJson["soap:Envelope"]["soap:Body"]["getPharmacyDrugPricingResponse"];
                                resolve({ code: 200, message: ``, coupons:data });
                              }catch(e){
                                 console.log("error message" + e.message);
                                 resolve({ code: '500', error: 'Internal Server Error', message: e.message });

                              }
                                //     let parser = new DOMParser();
                                //     let xmlDoc = parser.parseFromString(text, "text/xml");
                                //     let xmlResult:string|any = "";
                                //     console.log('text',response.body);
                                //     if( xmlDoc.getElementsByTagName(`${elementToParse}`).length === 1)
                                //     {

                                //         for (let i = 0; i < xmlDoc.getElementsByTagName(`${elementToParse}`).length; i++) {
                                //             xmlResult += xmlDoc.getElementsByTagName(`${elementToParse}`)[i].childNodes[0].nodeValue;
                                //         }
                                //        // xmlResult = xmlResult.split(',');
                                //         resolve({code:response.statusCode,message:'',prescriptions:xmlResult});

                                //     }
                                //     else if( xmlDoc.getElementsByTagName(`${elementToParse}`).length > 1)
                                //     {
                                //         for (let i = 0; i < xmlDoc.getElementsByTagName(`${elementToParse}`).length; i++) {
                                //             xmlResult += xmlDoc.getElementsByTagName(`${elementToParse}`)[i].childNodes[0].nodeValue + ",";
                                //         }
                                //         xmlResult = xmlResult.split(',');
                                //         resolve({code:response.statusCode,message:'',prescriptions:xmlResult});
                                //    }
                                //    else{
                                //     resolve({code:204,message:`No Data for ${args.prescription}`,prescriptions:[]});
                                //    }

                            }
                            else {
                                resolve({ code: 204, message: `No Data for ${args.prescription}`, prescriptions: [] });
                            }
                        });


                    }
                    query(prescription, 'drugNameSuggestion');


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
