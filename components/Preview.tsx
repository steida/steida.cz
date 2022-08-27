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

  // 280 is Tweet max length.
  const preview = createPreview(text)({ maxLength: 140 });

  return (
    <>
      {preview.text}
      {preview.isTrimmed && (
        <>
          <> </>
          <button
            onClick={() => {
              expandPreview(timestamp);
            }}
            className={styles.button}
          >
            Číst dále
          </button>
        </>
      )}
    </>
  );
};
