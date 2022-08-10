import React from 'react';
import { Route , Switch } from 'react-router-dom';
import Login from './component/Login/Login';
import './App.css';
import Registration from './component/Registration/Registration';
import NavBar from './component/NavigationBar/NavBar';
import welcomepage from './component/WelcomePage/welcomepage';
import Layout from './hoc/Layout/Layout';
import Members from './Members/Members';
import MembersProfile from './Members/MembersProfile/MemberProfile';
//import ApolloClient from 'apollo-boost';
import { ApolloProvider,ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'
const client = new ApolloClient({
   uri: 'http://localhost:8080/graphql',
   cache: new InMemoryCache()   
});



function App() {
  return (
    
      <div className="App">
       <ApolloProvider client={client}>
         <NavBar />
            <Switch>
              <Route exact path="/membersProfile"  component= { MembersProfile } />
              <Route exact path="/members" component={ Members }  />
              <Route exact path="/questionare" component={ Layout }  />
              <Route exact path="/registration" component={ Registration }  />
              <Route exact path="/login" component={ Login }  />
              <Route exact path="/" component={ welcomepage}  />              
            </Switch>
        </ApolloProvider>  
          
        </div>
     
  )
}

export default App;
