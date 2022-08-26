import { FC, ReactNode } from "react";
import styles from "./Text.module.css";

export const Text: FC<{
  readonly children: ReactNode;
  readonly variant?: "h1" | "h2" | "p";
}> = ({ children, variant = "p" }) => {
  return (
    <div
      className={
        variant === "h1" ? styles.h1 : variant === "h2" ? styles.h2 : styles.p
      }
    >
      {children}
    </div>
  );
};
