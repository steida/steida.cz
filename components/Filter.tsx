import { string } from "fp-ts";
import { FC } from "react";
import styles from "./Filter.module.css";

export const Filter: FC<{
  readonly filter: string;
  readonly onChange: (value: string) => void;
}> = ({ filter, onChange }) => {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        value={filter}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      {["anarchie", "bitcoin"].map((s) => (
        <button key={s} onClick={() => onChange(s)}>
          {s}
        </button>
      ))}
      <button onClick={() => onChange(string.empty)}>všechno</button>
    </div>
  );
};
