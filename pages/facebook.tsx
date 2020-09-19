import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { Status } from '../components/Status';
import { Text } from '../components/Text';
import statuses from '../data/statuses.json';

export async function getStaticProps() {
  const minimalStatuses: {
    id: string;
    created_time: string;
    message: string;
  }[] = statuses
    .filter(s => {
      if (
        s.message == null ||
        s.reactions == null ||
        s.link != null ||
        s.type !== 'status'
      )
        return false;
      if (s.reactions.summary.total_count < 10) return false;
      return true;
    })
    // That's shame TS can't infer it. There is a Github issue for that.
    .sort((a: any, b: any) => {
      return b.reactions.summary.total_count - a.reactions.summary.total_count;
    })
    .map(a => ({
      id: a.id,
      created_time: a.created_time,
      message: a.message as string,
    }));

  return {
    props: {
      statuses: minimalStatuses,
    },
  };
}

const Facebook = ({
  statuses,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>Daniel Steigerwald - Vybranné Facebook statusy</title>
      </Head>
      <Text variant="h1">Daniel Steigerwald</Text>
      <Text variant="h2">Vybranné Facebook statusy</Text>
      <Text>Roky 2017 až 2020. Seřazeno dle počtu reakcí. Promazáno.</Text>
      {statuses.map(s => {
        return (
          <Status
            key={s.id}
            id={s.id}
            createdTime={s.created_time}
            message={s.message}
          />
        );
      })}
    </div>
  );
};

export default Facebook;
