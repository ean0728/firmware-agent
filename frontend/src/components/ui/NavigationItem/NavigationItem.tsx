import { NavLink } from 'react-router-dom';
import styles from './NavigationItem.module.css';

interface NavigationItemProps {
  to: string;
  label: string;
  end?: boolean;
}

export function NavigationItem({ to, label, end }: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
    >
      {label}
    </NavLink>
  );
}
