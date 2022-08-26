import { number, ord, readonlyArray, string } from "fp-ts";
import { pipe } from "fp-ts/function";
import { FC, useDeferredValue, useMemo } from "react";
import { removeDiacriticsAndUpperCase } from "../lib/removeDiacriticsAndUpperCase";
import { useAppState } from "../lib/useAppState";
import { SortBy, UiStatus, UiStatuses } from "../types";
import { UiStatusItem } from "./UiStatusItem";
import styles from "./UiStatusList.module.css";

const ordUiStatusTextLength = pipe(
  number.Ord,
  ord.contramap((s: UiStatus) => s.text.length)
);

const getLengthLabel = (length: number): string => {
  switch (length) {
    case 1:
      return "status";
    case 2:
    case 3:
    case 4:
      return "statusy";
    default:
      return "statusů";
  }
};

export const UiStatusList: FC<{
  readonly filter: string;
  readonly statuses: UiStatuses;
  readonly isPending: boolean;
}> = ({ filter, statuses, isPending }) => {
  const filterForSearch = useMemo(
    () => removeDiacriticsAndUpperCase(filter),
    [filter]
  );
  const filteredStatuses = useMemo(
    () =>
      statuses.filter(
        ({ textForSearch }) =>
          filterForSearch.length === 0 ||
          textForSearch.includes(filterForSearch)
      ),
    [filterForSearch, statuses]
  );

  const sortBy = useAppState((s) => s.sortBy);
  const setSortBy = useAppState((s) => s.setSortBy);
  const deferredSortBy = useDeferredValue(sortBy);

  // // eslint-disable-next-line no-console
  // console.time("list");
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.timeEnd("list");
  // });

  const header = useMemo(
    () => (
      <div className={styles.header}>
        {`${filteredStatuses.length}`} {getLengthLabel(filteredStatuses.length)}
        <br />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as SortBy);
          }}
        >
          <option value="timestamp">nejnovější</option>
          <option value="length">nejstručnější</option>
        </select>
      </div>
    ),
    [filteredStatuses.length, setSortBy, sortBy]
  );

  const sortedFilteredStatuses = useMemo(
    () =>
      pipe(
        deferredSortBy === "timestamp"
          ? filteredStatuses
          : pipe(filteredStatuses, readonlyArray.sort(ordUiStatusTextLength)),
        readonlyArray.map((s) => <UiStatusItem status={s} key={s.timestamp} />)
      ),
    [deferredSortBy, filteredStatuses]
  );

  return (
    <div className={isPending ? styles.pending : string.empty}>
      {header}
      {sortedFilteredStatuses}
    </div>
  );
};
