import { string } from "fp-ts";
import Link from "next/link";
import { FC } from "react";
import { useAppState } from "../lib/useAppState";
import type { UiStatus } from "../types";
import { Preview } from "./Preview";
import styles from "./UiStatusItem.module.css";

export const UiStatusItem: FC<{
  readonly status: UiStatus;
  readonly noCheckbox?: boolean;
  readonly onlyPreview?: boolean;
}> = ({
  status: { timestamp, text, formattedDate },
  noCheckbox,
  onlyPreview,
}) => {
  const isSelected = useAppState((s) => s.selected.includes(timestamp));
  const select = useAppState((s) => s.select);
  const unselect = useAppState((s) => s.unselect);

  // // eslint-disable-next-line no-console
  // console.time(timestamp);
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.timeEnd(timestamp);
  // });

  return (
    <div className={styles.status}>
      <div className={styles.header}>
        <Link
          href={{
            pathname: "/status/[timestamp]",
            query: { timestamp },
          }}
        >
          <a className={styles.headerLink}>{formattedDate}</a>
        </Link>
      </div>
      <div
        className={`${styles.content} ${
          isSelected ? styles.selected : string.empty
        }`}
      >
        {onlyPreview ? <Preview text={text} timestamp={timestamp} /> : text}
      </div>
      {noCheckbox !== true && (
        <label className={styles.footer}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={({ target: { checked } }) => {
              if (checked) select(timestamp);
              else unselect(timestamp);
            }}
          />
        </label>
      )}
    </div>
  );
};
