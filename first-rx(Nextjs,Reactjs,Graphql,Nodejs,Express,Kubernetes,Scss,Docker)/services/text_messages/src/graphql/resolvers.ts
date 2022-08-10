const request = require('postman-request');
const { response } = require('express');
// const dotenv = require('dotenv');
// dotenv.config();

let envVariables = process.env.APIKEYS === undefined ? "" : process.env.APIKEYS.toString();
let obj = JSON.parse(JSON.stringify(envVariables));

const client = require('twilio')(
    obj['twilio-key'],
    obj['twilio-token']
  );

module.exports = {
    Mutation: {
        SendTextMessageMutation: async (parent: any, args: any, context: any, info: any) => {


            let phone_number = args.value;

            return await new Promise((resolve, reject) => {
                client.messages
                    .create({
                        from: process.env.TWILLO_PHONENUMBER,
                        to: phone_number,
                        body: 'this is a test from FirstRx'
                    })
                    .then(() => {
                        resolve({ code: 200, message: `Coupon sent to phone number ${phone_number}` });
                    })
                    .catch((err: any) => {
                        console.log(err);
                        resolve({ code: 400, message: `there was an error${err}` });
                    });

            }).then((response) => { console.log('inside response', response); return response; });

        }

    },
    Query: {
        hello: () => "Hello world",
    }
}
