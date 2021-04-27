// special file that is global throughout other pages
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import '../components/styles/nprogress.css';

import { ApolloProvider } from '@apollo/client';
import withData from '../lib/withData';
import Page from '../components/Page';
import { CartProvider } from '../hooks/useCart';

// withData provides access to apollo context
function MyApp({ Component, pageProps, apollo }) {
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeStart', NProgress.start);
    router.events.on('routeChangeComplete', NProgress.done);
    router.events.on('routeChangeError', NProgress.done);

    return () => {
      router.events.off('routeChangeStart', NProgress.start);
      router.events.off('routeChangeComplete', NProgress.done);
      router.events.off('routeChangeError', NProgress.done);
    };
  }, []);
  return (
    <ApolloProvider client={apollo}>
      <CartProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </CartProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (apolloContext) => {
  const { Component, ctx } = apolloContext;
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  // when navigate url with query param
  // we can get query to the page directly, without having to useRouter to get query all the time
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
