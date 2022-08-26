import { either, readonlyArray, string } from "fp-ts";
import { Endomorphism } from "fp-ts/Endomorphism";
import { constant, flow, pipe } from "fp-ts/function";
import { Predicate } from "fp-ts/Predicate";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useIntl } from "react-intl";
import { UiStatusItem } from "../../components/UiStatusItem";
import statuses from "../../data/statuses.json";
import { createFormattedDate } from "../../lib/createFormattedDate";
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

type Words = readonly string[];

const createTitleFromWords = (words: Words): string =>
  createTitle(words.join(" "));

const titleIsNotTooLong: Predicate<Words> = (words) =>
  createTitleFromWords(words).length < 70;

const textToWords: (s: string) => Words = flow(
  string.trim,
  string.split(/\s+/)
);

const createTitleWithMaxLength: Endomorphism<string> = flow(
  textToWords,
  readonlyArray.reduce(either.right<Words, Words>([]), (words, word) =>
    pipe(
      words,
      either.map(readonlyArray.append(word)),
      either.filterOrElseW(titleIsNotTooLong, readonlyArray.dropRight(1))
    )
  ),
  either.getOrElseW(
    readonlyArray.matchRightW(constant(readonlyArray.empty), (init, last) => [
      ...init,
      last + "…",
    ])
  ),
  createTitleFromWords
);

const StatusDetail: NextPage<Props> = ({ status }) => {
  const intl = useIntl();

  return (
    <>
      <Head>
        <title>{createTitleWithMaxLength(status.text)}</title>
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
