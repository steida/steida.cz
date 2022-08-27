import { string } from "fp-ts";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useIntl } from "react-intl";
import { UiStatusItem } from "../../components/UiStatusItem";
import statuses from "../../data/statuses.json";
import { createFormattedDate } from "../../lib/createFormattedDate";
import { createPreview } from "../../lib/createPreview";
import { createTitle } from "../../lib/createTitle";
import { Status } from "../../types";

interface Props {
  readonly status: Status;
}

// Next.js types workaround.
// https://github.com/vercel/next.js/discussions/16522
interface Params extends ParsedUrlQuery {
  readonly timestamp: string;
}

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: statuses.map(({ timestamp }) => ({
    params: { timestamp: timestamp.toString() },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props, Params> = ({ params }) => ({
  props: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    status: statuses.find((s) => s.timestamp === params!.timestamp) as Status,
  },
});

const StatusDetail: NextPage<Props> = ({ status }) => {
  const intl = useIntl();
  const title = createPreview(status.text)({
    maxLength: 70,
    modifier: createTitle,
  }).text;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <UiStatusItem
        status={{
          ...status,
          textForSearch: string.empty,
          formattedDate: createFormattedDate(status.timestamp)(intl),
        }}
        key={status.timestamp}
      />
    </>
  );
};

export default StatusDetail;
