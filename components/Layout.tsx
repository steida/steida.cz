import Link from "next/link";
import { FC, ReactNode } from "react";
import { Text } from "../components/Text";
import { createTitle } from "../lib/createTitle";
import { Hr } from "./Hr";
import styles from "./Layout.module.css";

export const Layout: FC<{ readonly children: ReactNode }> = ({ children }) => (
  <div className={styles.layout}>
    <Link href="/">
      <a>
        <Text variant="h1">{createTitle()}</Text>
      </a>
    </Link>
    <Hr />
    {children}
  </div>
);
