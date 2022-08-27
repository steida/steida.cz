import { FC } from "react";
import { createPreview } from "../lib/createPreview";
import { useAppState } from "../lib/useAppState";
import styles from "./Preview.module.css";

export const Preview: FC<{
  readonly text: string;
  readonly timestamp: string;
}> = ({ text, timestamp }) => {
  const expandPreview = useAppState((s) => s.expandPreview);
  const isExpanded = useAppState((s) => s.expandedPreviews[timestamp] === true);

  if (isExpanded) return <>{text}</>;

  return (
    <>
      {createPreview(text)({ maxLength: 280 }).text}{" "}
      <button
        onClick={() => {
          expandPreview(timestamp);
        }}
        className={styles.button}
      >
        Číst dále
      </button>
    </>
  );
};
