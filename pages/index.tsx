import Head from 'next/head';
import Link from 'next/link';
import { Text } from '../components/Text';

const Index = () => {
  return (
    <div>
      <Head>
        <title>Daniel Steigerwald</title>
      </Head>
      <Text variant="h1">Daniel Steigerwald</Text>
      <Text>
        <Link href="/facebook">
          <a>Vybranné Facebook statusy</a>
        </Link>
      </Text>
    </div>
  );
};

export default Index;
