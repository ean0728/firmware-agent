import type { ReactNode } from 'react';
import { useState } from 'react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { DesktopSidebar } from '../DesktopSidebar/DesktopSidebar';
import { MobileHeader } from '../MobileHeader/MobileHeader';
import { SidebarDrawer } from '../SidebarDrawer/SidebarDrawer';
import styles from './AdminShell.module.css';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface AdminShellProps {
  children: ReactNode;
  navItems: NavItem[];
  accountLabel: string;
  accountAction?: string;
}

export function AdminShell({ children, navItems, accountLabel, accountAction = '退出登录' }: AdminShellProps) {
  const breakpoint = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebar = (
    <DesktopSidebar
      variant="admin"
      navItems={navItems}
      accountSectionLabel="SYSTEM ADMIN"
      accountLabel={accountLabel}
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
