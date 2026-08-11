import type { ReactNode } from 'react';
import { useState } from 'react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { DesktopSidebar } from '../DesktopSidebar/DesktopSidebar';
import { MobileHeader } from '../MobileHeader/MobileHeader';
import { SidebarDrawer } from '../SidebarDrawer/SidebarDrawer';
import styles from './UserShell.module.css';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface UserShellProps {
  children: ReactNode;
  navItems: NavItem[];
  accountLabel: string;
  accountInitials: string;
  accountAction?: string;
}

export function UserShell({
  children,
  navItems,
  accountLabel,
  accountInitials,
  accountAction = '账号与退出',
}: UserShellProps) {
  const breakpoint = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebar = (
    <DesktopSidebar
      variant="user"
      navItems={navItems}
      accountSectionLabel="MY ACCOUNT"
      accountLabel={accountLabel}
      accountInitials={accountInitials}
      accountAction={accountAction}
      onNavigate={() => setDrawerOpen(false)}
    />
  );

  return (
    <div className={styles.shell}>
      {breakpoint === 'desktop' ? sidebar : null}
      {(breakpoint === 'tablet' || breakpoint === 'mobile') ? (
        <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {sidebar}
        </SidebarDrawer>
      ) : null}
      <div className={styles.main}>
        {breakpoint !== 'desktop' ? (
          <MobileHeader title="FIRMWARE / AGENT" onMenuClick={() => setDrawerOpen(true)} />
        ) : null}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
