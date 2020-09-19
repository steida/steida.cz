import { ReactNode } from 'react';
import styles from './Text.module.css';

export const Text = ({
  children,
  variant = 'p',
}: {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'p';
}) => {
  return (
    <div
      className={
        variant === 'h1' ? styles.h1 : variant === 'h2' ? styles.h2 : styles.p
      }
    >
      {children}
    </div>
  );
};
