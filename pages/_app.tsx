import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { IntlProvider } from 'react-intl';
import '../styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* TODO: Use cs when Node.js 13+ will be in AWS */}
      <IntlProvider locale="en">
        <Component {...pageProps} />
      </IntlProvider>
    </>
  );
};

export default MyApp;
