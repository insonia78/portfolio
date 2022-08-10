const { gql } = require('apollo-server-express');

module.exports = gql(`
        
        type DrugNameSuggestion{
            _text:String
        }
        type GetPrescriptionDetails{
            code:Int
            message:String
            prescriptions:[DrugNameSuggestion]
            error:String
        }
        type Query{            
            hello:String
        } 
        type Mutation{            
            prescription(prescription:String):GetPrescriptionDetails
        } 
        schema{
            query:Query
            mutation:Mutation
        }

`);
