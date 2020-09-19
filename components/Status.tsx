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
    <div>{createdTime}</div>
    <div className={styles.message}>{message}</div>
  </div>
);
