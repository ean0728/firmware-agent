import type { ReactNode } from 'react';
import styles from './LoginLayout.module.css';

interface LoginLayoutProps {
  brandTitle: string;
  brandSubtitle: string;
  brandFooter: string;
  formTitle: string;
  formSubtitle: string;
  formFooter: string;
  formHint?: string;
  children: ReactNode;
}

export function LoginLayout({
  brandTitle,
  brandSubtitle,
  brandFooter,
  formTitle,
  formSubtitle,
  formFooter,
  formHint,
  children,
}: LoginLayoutProps) {
  return (
    <div className={styles.page}>
      <aside className={styles.brand}>
        <div className={styles.mark} />
        <p className={styles.brandLabel}>FIRMWARE / AGENT</p>
        <h1 className={styles.brandTitle}>{brandTitle}</h1>
        <p className={styles.brandSubtitle}>{brandSubtitle}</p>
        <p className={styles.brandFooter}>{brandFooter}</p>
      </aside>
      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{formTitle}</h2>
          <p className={styles.formSubtitle}>{formSubtitle}</p>
          <div className={styles.formBody}>{children}</div>
          <p className={styles.formFooter}>{formFooter}</p>
          {formHint ? <p className={styles.formHint}>{formHint}</p> : null}
        </div>
      </section>
    </div>
  );
}
