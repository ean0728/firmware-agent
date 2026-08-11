import { Avatar, NavigationItem } from '../../ui';
import styles from './DesktopSidebar.module.css';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface DesktopSidebarProps {
  variant: 'admin' | 'user';
  navItems: NavItem[];
  accountSectionLabel: string;
  accountLabel: string;
  accountInitials?: string;
  accountAction: string;
  onNavigate?: () => void;
}

export function DesktopSidebar({
  variant,
  navItems,
  accountSectionLabel,
  accountLabel,
  accountInitials,
  accountAction,
  onNavigate,
}: DesktopSidebarProps) {
  const widthClass = variant === 'admin' ? styles.admin : styles.user;

  return (
    <aside className={`${styles.sidebar} ${widthClass}`}>
      <div className={styles.top}>
        <div className={styles.mark} />
        <p className={styles.brand}>FIRMWARE / AGENT</p>
        <nav className={styles.nav} onClick={onNavigate}>
          {navItems.map((item) => (
            <NavigationItem key={item.to} to={item.to} label={item.label} end={item.end} />
          ))}
        </nav>
      </div>
      <div className={styles.account}>
        <p className={styles.accountLabel}>{accountSectionLabel}</p>
        <div className={styles.accountRow}>
          {accountInitials ? <Avatar initials={accountInitials} /> : null}
          <div>
            <p className={styles.accountName}>{accountLabel}</p>
            <p className={styles.accountAction}>{accountAction}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
