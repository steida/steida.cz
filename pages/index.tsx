import { io, ioOption, ioRef, readonlyNonEmptyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useDeferredValue } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Filter } from "../components/Filter";
import { UiStatusList } from "../components/UiStatusList";
import statuses from "../data/statuses.json";
import { createFormattedDate } from "../lib/createFormattedDate";
import { createTitle } from "../lib/createTitle";
import { removeDiacriticsAndUpperCase } from "../lib/removeDiacriticsAndUpperCase";
import { useAppState } from "../lib/useAppState";
import { Statuses, UiStatus, UiStatuses } from "../types";

export const getStaticProps: GetStaticProps<{
  readonly statuses: Statuses;
}> = () =>
  pipe(statuses, (statuses) => ({
    props: { statuses },
  }));

const createInitialUiStatuses =
  (statuses: Statuses, intl: IntlShape): IO<UiStatuses> =>
  () =>
    statuses.map(
      (status): UiStatus => ({
        ...status,
        textForSearch: removeDiacriticsAndUpperCase(status.text),
        formattedDate: createFormattedDate(status.timestamp)(intl),
      })
    );

// A cache for keeping state across pages.
const initialUiStatusesRef = new ioRef.IORef<UiStatuses>([]);

// It's IO because it writes to ioRef.
const getInitialUiStatuses = (
  statuses: Statuses,
  intl: IntlShape
): IO<UiStatuses> =>
  pipe(
    initialUiStatusesRef.read,
    io.map(readonlyNonEmptyArray.fromReadonlyArray),
    ioOption.getOrElse(() =>
      pipe(
        createInitialUiStatuses(statuses, intl),
        io.chainFirst(initialUiStatusesRef.write)
      )
    )
  );

const Index: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  statuses,
}) => {
  const intl = useIntl();
  const uiStatuses = getInitialUiStatuses(statuses, intl)();
  const filter = useAppState((s) => s.filter);
  const deferredFilter = useDeferredValue(filter);
  const setFilter = useAppState((s) => s.setFilter);

  return (
    <>
      <Head>
        <title>{createTitle()}</title>
      </Head>
      <Filter filter={filter} onChange={setFilter} />
      <UiStatusList
        filter={deferredFilter}
        statuses={uiStatuses}
        isPending={filter !== deferredFilter}
      />
    </>
  );
};

export default Index;
