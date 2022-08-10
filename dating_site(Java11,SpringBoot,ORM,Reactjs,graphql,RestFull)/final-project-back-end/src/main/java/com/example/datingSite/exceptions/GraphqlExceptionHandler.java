package com.example.datingSite.exceptions;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import graphql.GraphQLException;
import graphql.kickstart.spring.error.ThrowableGraphQLError;
@Component
public class GraphqlExceptionHandler {

  
    @ExceptionHandler(GraphQLException.class)

    public ThrowableGraphQLError handle(GraphQLException e){

        return new ThrowableGraphQLError(e);
    }

}