import styles from './StatusBadge.module.css';

type StatusVariant = 'active' | 'expiring' | 'disabled' | 'success' | 'denied';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

export function StatusBadge({ label, variant = 'active' }: StatusBadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
