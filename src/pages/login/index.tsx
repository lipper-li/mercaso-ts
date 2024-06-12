import styles from './index.module.scss';

type LoginProps = {
  account: string;
  password: string;
};

export function Login({ account, password }: LoginProps) {
  return (
    <div className={styles.login}>
      <p className={styles.account}>{account}</p>
      <p className={styles.password}>{password}</p>
    </div>
  );
}
