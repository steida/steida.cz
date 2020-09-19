import Head from 'next/head';
import Link from 'next/link';

const Index = () => {
  return (
    <div>
      <Head>
        <title>Daniel Steigerwald</title>
      </Head>
      <h1>Daniel Steigerwald</h1>
      <Link href="/facebook">
        <a>Vybranné Facebook statusy</a>
      </Link>
    </div>
  );
};

export default Index;
