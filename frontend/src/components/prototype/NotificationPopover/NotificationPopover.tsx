import { useEffect, useRef, useState } from 'react';
import { notifications } from '../../../fixtures/notifications.fixture';
import type { NotificationItem } from '../../../types/notification';
import styles from './NotificationPopover.module.css';

interface NotificationPopoverProps {
  items?: NotificationItem[];
}

export function NotificationPopover({ items = notifications }: NotificationPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unreadCount = items.filter((n) => n.unread).length;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-label="通知"
        onClick={() => setOpen((v) => !v)}
      >
        {unreadCount > 0 ? unreadCount : '•'}
      </button>
      {open ? (
        <div className={styles.popover} role="dialog" aria-label="通知列表">
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemDesc}>{item.description}</p>
              <p className={styles.itemTime}>{item.time}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
