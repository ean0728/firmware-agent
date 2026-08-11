import styles from './Avatar.module.css';

interface AvatarProps {
  initials: string;
  size?: number;
}

export function Avatar({ initials, size = 36 }: AvatarProps) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size, fontSize: size <= 36 ? 12 : 14 }}>
      {initials}
    </span>
  );
}
