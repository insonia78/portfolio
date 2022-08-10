import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,

} from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import { useMemo } from "react";

let apolloClient: ApolloClient<NormalizedCacheObject>;
class HelperValue {
    value:string;
   constructor(){
      
   }
   public getValue(){
       return this.value;
   }
   public setValue(v){
       this.value = v;
   }

}

const baseUri = new HttpLink({
    uri: "/api/graphql"
})
const locationUri = new HttpLink({
    uri: `${process.env.LOCATION_SERVICE_API_URL}/graphql`
})
const prescriptionsUri = new HttpLink({
    uri: `${process.env.PRESCRIPTIONS_SERVICE_API_URL}/graphql`
})
const couponUri = new HttpLink({
    uri: `${process.env.COUPON_SERVICE_API_URL}/graphql`
})
const textMessageUri = new HttpLink({
    uri: `${process.env.TEXT_MESSAGE_SERVICE_API_URL}/graphql`
})

let helperValue= new HelperValue();;
function createIsomorphicLink() {
    if (typeof window === "undefined") {
        // server
        const { SchemaLink } = require("@apollo/client/link/schema");
        const { schema } = require("./schema");
        return new SchemaLink({ schema });
    } else {
        // client
        const { HttpLink } = require("@apollo/client/link/http");
    }
    //return new HttpLink({ uri: "/api/graphql" });
    return undefined;
}
function createApolloClient() {

    return new ApolloClient({
        
        ssrMode: typeof window === undefined,
        link: (createIsomorphicLink() === undefined ?
        
        ApolloLink.split(
               
            operation => operation.getContext().clientName === 'prescriptions',            
              prescriptionsUri,
             ApolloLink.split(operation => operation.getContext().clientName === 'location',                        
                    locationUri,                    
                    ApolloLink.split(operation => operation.getContext().clientName === 'coupon',                        
                    couponUri,
                    ApolloLink.split(operation => operation.getContext().clientName === 'textMessage',                        
                    textMessageUri,
                    baseUri
                      )
                    
                    )
            
                 )
            )
        
        :createIsomorphicLink()),
        cache: new InMemoryCache()
    })
    
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();
    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }
    if (typeof window === undefined) return _apolloClient;
    apolloClient = apolloClient ?? _apolloClient;

    return apolloClient;

}
export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);

    return store;

}