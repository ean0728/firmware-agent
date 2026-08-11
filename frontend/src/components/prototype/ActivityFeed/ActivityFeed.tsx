import type { ActivityItem } from '../../../types/auth';
import styles from './ActivityFeed.module.css';

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>最近治理动态</h2>
        <button type="button" className={styles.link}>
          查看全部
        </button>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.dot} />
            <div className={styles.body}>
              <p className={styles.type}>{item.type}</p>
              <p className={styles.desc}>{item.description}</p>
            </div>
            <time className={styles.time}>{item.time}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
