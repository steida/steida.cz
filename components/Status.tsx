import React from 'react';
import { FormattedDate } from 'react-intl';
import styles from './Status.module.css';

export const Status = ({
  id,
  createdTime,
  message,
}: {
  id: string;
  createdTime: string;
  message: string;
}) => (
  <div key={id} className={styles.status}>
    <a
      target="_blank"
      href={`https://www.facebook.com/daniel.steigerwald/posts/${
        id.split('_')[1]
      }`}
      className={styles.timeLink}
    >
      <FormattedDate
        value={createdTime}
        year="numeric"
        month="long"
        day="numeric"
      />
    </a>
    <div className={styles.message}>{message}</div>
  </div>
);
