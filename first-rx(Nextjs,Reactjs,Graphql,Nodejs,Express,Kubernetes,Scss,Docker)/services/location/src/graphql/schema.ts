const { gql } = require('apollo-server-express');

module.exports = gql(`

        type LocationFromGeoLocationApi{
            lat:Float
            lng:Float
        }
        type GeometryFromGeoLocationApi{
            location:LocationFromGeoLocationApi
        }
        type ResultsFromGeoLocationApi{
            geometry:GeometryFromGeoLocationApi
            
        }
        type PredictionsFromPlaceApi{
             description:String 
        } 
        type GetLocationFromZipOrCityMutation{
             results:[ResultsFromGeoLocationApi]
             predictions:[PredictionsFromPlaceApi] 
             code:Int
             message:String
             country: String
             state: String
             city: String
        }
        type Query{
            
            hello:String

        } 
        type Mutation{
            
            GetLocationFromZipOrCity(value:String):GetLocationFromZipOrCityMutation
        } 
        schema{
            query:Query
            mutation:Mutation
        }

`);