import styles from './MobileHeader.module.css';

interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function MobileHeader({ title, onMenuClick }: MobileHeaderProps) {
  return (
    <header className={styles.header}>
      <button type="button" className={styles.menuButton} onClick={onMenuClick} aria-label="打开导航">
        ☰
      </button>
      <span className={styles.title}>{title}</span>
    </header>
  );
}
