import { InferGetStaticPropsType } from 'next';
import statuses from '../data/statuses.json';
import { Status } from '../types';

export async function getStaticProps() {
  const filteredAndSorted = statuses
    .filter(s => {
      if (s.message == null || s.reactions == null || s.link != null)
        return false;
      if (s.reactions.summary.total_count < 10) return false;
      return true;
    })
    // That's shame TS can't infer it. There is a Github issue for that.
    .sort((a: any, b: any) => {
      return b.reactions.summary.total_count - a.reactions.summary.total_count;
    });

  return {
    props: {
      statuses: filteredAndSorted,
    },
  };
}

const Facebook = ({
  statuses,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      {statuses.length}{' '}
      {statuses.map(s => {
        if (s.reactions == null) return null;
        return (
          <div key={s.id}>
            <div>{s.id}</div>
            <div>{s.created_time}</div>
            <div>{s.message}</div>
            <div>{s.reactions.summary.total_count}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Facebook;
