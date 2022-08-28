import { readonlyArray, readonlyRecord, string } from "fp-ts";
import { pipe, tuple } from "fp-ts/function";
import { Option } from "fp-ts/Option";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useIntl } from "react-intl";
import { Text } from "../../components/Text";
import { UiStatusItem } from "../../components/UiStatusItem";
import statuses from "../../data/statuses.json";
import { createFormattedDate } from "../../lib/createFormattedDate";
import { createTitle } from "../../lib/createTitle";
import { useAppState } from "../../lib/useAppState";
import { Status, Statuses } from "../../types";

// export const config = {
//   runtime: "experimental-edge",
// };

interface Props {
  readonly name?: string;
  readonly statuses?: Statuses;
}

// Next.js types workaround.
// https://github.com/vercel/next.js/discussions/16522
interface Params extends ParsedUrlQuery {
  readonly name: string;
  readonly timestamps: string;
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, Params> = ({ params }) =>
  pipe(
    {
      timestamps: params?.timestamps.split("-") || [],
      statuses: pipe(
        statuses,
        readonlyArray.map((status) => tuple(status.timestamp, status)),
        readonlyRecord.fromEntries
      ),
    },
    ({ timestamps, statuses }) =>
      pipe(
        timestamps,
        readonlyArray.filterMap(
          (timestamp): Option<Status> =>
            pipe(statuses, readonlyRecord.lookup(timestamp))
        )
      ),
    (statuses) => ({
      props: {
        name: params?.name.slice(0, 1000) || string.empty,
        statuses,
      },
    })
  );

const Statuses: NextPage<Props> = ({ name, statuses }) => {
  const intl = useIntl();
  const setSelected = useAppState((s) => s.setSelected);
  const router = useRouter();

  const handleEditClick = () => {
    if (statuses == null) return;
    pipe(
      statuses,
      readonlyArray.map((s) => s.timestamp),
      setSelected
    );
    router.push("/");
  };

  if (statuses == null)
    return (
      <Head>
        <title>{createTitle(name)}</title>
      </Head>
    );

  return (
    <>
      <Head>
        <title>{createTitle(name)}</title>
      </Head>
      <Text variant="h2">
        {name}
        <button onClick={handleEditClick} style={{ float: "right" }}>
          edit
        </button>
      </Text>
      {statuses.map((s) => (
        <UiStatusItem
          status={{
            ...s,
            textForSearch: string.empty,
            formattedDate: createFormattedDate(s.timestamp)(intl),
          }}
          noCheckbox
          key={s.timestamp}
        />
      ))}
    </>
  );
};

export default Statuses;
