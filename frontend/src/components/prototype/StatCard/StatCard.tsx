import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  meta: string;
}

export function StatCard({ label, value, meta }: StatCardProps) {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <p className={styles.meta}>{meta}</p>
    </article>
  );
}
