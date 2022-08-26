import type { AppProps } from "next/app";
import Head from "next/head";
import { IntlProvider } from "react-intl";
import { Layout } from "../components/Layout";
import { Selected } from "../components/Selected";
import { useFathom } from "../lib/useFathom";
import "../styles/global.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useFathom();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>
      <IntlProvider locale="cs" timeZone="Europe/Prague">
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Selected />
      </IntlProvider>
    </>
  );
};

export default MyApp;
