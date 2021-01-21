import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import AuthProvider from '../context/AuthProvider';
import MeQuery from '../graphql/query/MeQuery';
import { initializeApollo, useApollo } from '../lib/apolloClient';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Head>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
              rel="stylesheet"
            />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <title>Cobashop</title>
          </Head>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const apolloClient = initializeApollo(appContext.ctx);

  await apolloClient
    .query({ query: MeQuery, errorPolicy: 'ignore' })
    .catch(() => {});

  const appProps = await App.getInitialProps(appContext);
  const { pageProps, ...newAppProps } = appProps;

  return {
    pageProps: {
      initialApolloState: apolloClient.cache.extract(),
    },
    ...newAppProps,
  };
};
export default MyApp;
