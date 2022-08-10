import { makeSchema, queryType } from '@nexus/schema';
import path from 'path';
import * as types from "./AllTypes";


// const Query = queryType({
//     definition(t){
//         t.string("name");
//     }
// });

// const types = { Query };

export const schema = makeSchema({
    types,
    outputs:{
        schema: path.join(process.cwd(),"schema.graphql")
    },
    typegenAutoConfig:
    {
        sources:
        [
            {
            alias:"faces",
            source: path.join(process.cwd(),'src','interfaces'),
            typeMatch: (type) => new RegExp(`(${type}Interface)`)
            },            
        ],
        debug: process.env.NODE_ENV === "development",
    }
});