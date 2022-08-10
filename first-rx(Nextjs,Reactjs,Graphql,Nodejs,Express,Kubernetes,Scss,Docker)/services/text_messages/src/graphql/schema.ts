const { gql } = require('apollo-server-express');

module.exports = gql(`

        
        type SendTextMessageResponseMutation{
             code:Int
             message:String
        }
        type Query{
            
            hello:String

        } 
        type Mutation{
            
            SendTextMessageMutation(value:String):SendTextMessageResponseMutation
        } 
        schema{
            query:Query
            mutation:Mutation
        }

`);