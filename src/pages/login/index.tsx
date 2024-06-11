import styles from './index.module.scss';

export function Login() {
  return (
    <div className={styles.login}>
      <p className={styles.account}>account</p>
      <p className={styles.password}>password</p>
    </div>
  );
}
