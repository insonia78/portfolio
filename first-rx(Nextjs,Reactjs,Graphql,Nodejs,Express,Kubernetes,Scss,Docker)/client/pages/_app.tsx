import { ApolloProvider } from '@apollo/client';
import { useApollo } from "components/apolloClient";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.scss';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import _Head from './src/components/_Head';
import { useEffect } from "react";



// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: '50px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}


// let windowWidth = window.innerWidth;
// let windowHeight = window.innerHeight;
function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  const getSizes = () => {

    let body = document.body;
    if (window.innerWidth > 550) {
      body.style.transform = `scale( ${((window.outerWidth - 10)
        / window.innerWidth).toString()})`;
      body.style.transformOrigin = '0 0';
      body.style.height = window.outerHeight.toString();
    }
    else{
      body.style.transform= 'none';
    }
    //console.log('windowWidth', windowWidth);  

  }
  useEffect(() => {
    window.addEventListener(
      "resize", getSizes, false);

  }, []);


  return (
    <ApolloProvider client={client}>
      <AlertProvider template={AlertTemplate} {...options}>
      <_Head />
      < Header />
      <Component {...pageProps} />
      <Footer />
      </AlertProvider>
    </ApolloProvider>

  );
}

export default MyApp
