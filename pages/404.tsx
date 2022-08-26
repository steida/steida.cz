import Head from "next/head";
import { Text } from "../components/Text";
import { createTitle } from "../lib/createTitle";

const Custom404 = () => (
  <>
    <Head>
      <title>{createTitle("Stránka nenalezena")}</title>
    </Head>
    <Text variant="h2">Stránka nenalezena.</Text>
  </>
);

export default Custom404;
