// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ApolloServer } from "apollo-server-micro";

import { schema } from './../../components/schema'; 

const server = new ApolloServer({schema});
const handler = server.createHandler({ path:'/api/graphql'});


export const config = {

  api:{
    bodyParser:false,
  }
}

export default handler;

// import { ApolloServer } from "apollo-server-lambda";


// import { schema } from './../../components/schema'; 
// import Mutation  from './../../components/AllTypes/index';


// const context ={}
// const server = new ApolloServer({
//    schema:{ typeDefs:schema,
                

//    },
  
// });


// const handler = server.createHandler({ path:'/api/graphql'});
// export const graphqlHandler = server.createHandler();
// export const config = {

//   api:{
//     bodyParser:false,
//   }
// }

// export default handler;