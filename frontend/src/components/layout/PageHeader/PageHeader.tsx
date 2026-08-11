import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';
import { NotificationPopover } from '../../prototype/NotificationPopover/NotificationPopover';
import type { NotificationItem } from '../../../types/notification';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showNotification?: boolean;
  notificationItems?: NotificationItem[];
}

export function PageHeader({
  title,
  subtitle,
  action,
  showNotification = false,
  notificationItems,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      <div className={styles.actions}>
        {action}
        {showNotification ? <NotificationPopover items={notificationItems} /> : null}
      </div>
    </header>
  );
}
