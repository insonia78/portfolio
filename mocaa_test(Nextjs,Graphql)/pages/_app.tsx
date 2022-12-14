import { ApolloProvider } from '@apollo/client';
import '../styles/globals.css';
import { useApollo } from "./../components/apolloClient";


function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);
  
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>

  )
}

export default MyApp
