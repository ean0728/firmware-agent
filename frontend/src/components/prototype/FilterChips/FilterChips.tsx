import styles from './FilterChips.module.css';

interface FilterChipsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, value, onChange }: FilterChipsProps) {
  return (
    <div className={styles.group}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`${styles.chip} ${value === option ? styles.active : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
