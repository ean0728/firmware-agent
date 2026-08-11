import { AdminShell } from '../../../components/layout/AdminShell';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ActivityFeed } from '../../../components/prototype/ActivityFeed/ActivityFeed';
import { StatCard } from '../../../components/prototype/StatCard/StatCard';
import { adminDashboard } from '../../../fixtures/admin-dashboard.fixture';
import { adminUser } from '../../../fixtures/auth.fixture';
import styles from './AdminOverviewPage.module.css';

const adminNav = [
  { to: '/admin/overview', label: '管理概览', end: true },
  { to: '/admin/users', label: '用户' },
  { to: '/admin/organization', label: '组织与协作' },
  { to: '/admin/audit', label: '审计日志' },
];

export function AdminOverviewPage() {
  const { stats, recentActivities, governanceHealth } = adminDashboard;

  return (
    <AdminShell navItems={adminNav} accountLabel={adminUser.displayName}>
      <PageHeader
        title="管理概览"
        subtitle="账号、组织与治理事件的全局视图"
        showNotification
      />
      <div className={styles.stats}>
        <StatCard label="活跃用户" value={stats.activeUsers.value} meta={stats.activeUsers.delta} />
        <StatCard label="组织" value={stats.organizations.value} meta={stats.organizations.label} />
        <StatCard label="协作项目" value={stats.projects.value} meta={stats.projects.label} />
        <StatCard label="待关注事件" value={stats.alerts.value} meta={stats.alerts.label} />
      </div>
      <div className={styles.lower}>
        <ActivityFeed items={recentActivities} />
        <section className={styles.health}>
          <h2 className={styles.healthTitle}>治理健康度</h2>
          <p className={styles.score}>
            {governanceHealth.score}
            <span>/ 100</span>
          </p>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${governanceHealth.score}%` }} />
          </div>
          <ul className={styles.healthList}>
            {governanceHealth.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className={styles.note}>{governanceHealth.note}</p>
        </section>
      </div>
    </AdminShell>
  );
}
