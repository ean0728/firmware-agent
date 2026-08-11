import styles from './ContextSelector.module.css';

interface Option {
  id: string;
  label: string;
}

interface ContextSelectorProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}

export function ContextSelector({ options, value, onChange }: ContextSelectorProps) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="协作上下文"
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
