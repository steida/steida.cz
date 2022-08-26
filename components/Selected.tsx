import Link from "next/link";
import * as Fathom from "fathom-client";
import slug from "slug";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo } from "react";
import { useAppState } from "../lib/useAppState";
import styles from "./Selected.module.css";
import classNames from "classnames";

// https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
const useBeforeUnload = (addEvent: boolean) => {
  useEffect(() => {
    if (!addEvent) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // eslint-disable-next-line functional/immutable-data
      return (e.returnValue = "Are you sure you want to exit?");
    };
    window.addEventListener("beforeunload", handleBeforeUnload, {
      capture: true,
    });
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload, {
        capture: true,
      });
    };
  }, [addEvent]);
};

const SelectedLink: FC<{
  readonly timestamp: string;
  readonly selected: boolean;
}> = ({ timestamp, selected }) => (
  <Link
    href={{
      pathname: "/status/[timestamp]",
      query: { timestamp },
    }}
  >
    <a className={classNames(styles.link, selected && styles.selectedLink)}>
      {timestamp}
    </a>
  </Link>
);

export const Selected = () => {
  const selected = useAppState((s) => s.selected);
  const unselectAll = useAppState((s) => s.unselectAll);
  const router = useRouter();

  useBeforeUnload(selected.length > 0);

  const selectedLinks = useMemo(
    () => (
      <div className={styles.links}>
        {selected.map((timestamp) => (
          <SelectedLink
            key={timestamp}
            timestamp={timestamp}
            selected={timestamp === router.query.timestamp}
          />
        ))}
      </div>
    ),
    [router.query.timestamp, selected]
  );

  const handleCreateLinkClick = () => {
    const name = window.prompt("Název", "");
    if (name == null || name.trim().length === 0) return;
    Fathom.trackGoal("8Q5DPB57", 0);

    unselectAll();
    router.push({
      pathname: "/[name]/[timestamps]",
      query: { name: slug(name), timestamps: selected.join("-") },
    });
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure?")) unselectAll();
  };

  if (selected.length === 0) return null;

  return (
    <div className={styles.selected}>
      {selectedLinks}
      <div>
        <button className={styles.button} onClick={handleCreateLinkClick}>
          create link
        </button>
        <button className={styles.button} onClick={handleDeleteClick}>
          ✕
        </button>
      </div>
    </div>
  );
};
