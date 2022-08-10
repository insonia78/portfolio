package com.example.datingSite.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import graphql.kickstart.servlet.apollo.ApolloScalars;
import graphql.schema.GraphQLScalarType;

@Configuration
public class GraphqlConfig {

   @Bean
   public GraphQLScalarType uploadScalarDefine() {
      return ApolloScalars.Upload;
   } 
}
