import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={activeId === item.id}
          disabled={item.disabled}
          className={`${styles.tab} ${activeId === item.id ? styles.active : ''}`}
          onClick={() => !item.disabled && onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
