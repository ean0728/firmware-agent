import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserShell } from '../../../components/layout/UserShell';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ContextSelector } from '../../../components/prototype/ContextSelector/ContextSelector';
import { currentUser } from '../../../fixtures/auth.fixture';
import { myOrganizations, recentCollaborations, userDashboard } from '../../../fixtures/collaboration.fixture';
import { memberTypeLabels } from '../../../fixtures/users.fixture';
import { notifications } from '../../../fixtures/notifications.fixture';
import styles from './UserOverviewPage.module.css';

const userNav = [
  { to: '/user/overview', label: '概览', end: true },
  { to: '/user/collaboration', label: '我的协作' },
];

export function UserOverviewPage() {
  const navigate = useNavigate();
  const [context, setContext] = useState('all');
  const dashboard = userDashboard;

  const filteredOrgs = useMemo(() => {
    if (context === 'all') return myOrganizations;
    return myOrganizations.filter((o) => o.id === context);
  }, [context]);

  const filteredCollabs = useMemo(() => {
    if (context === 'all') return recentCollaborations;
    const orgName = myOrganizations.find((o) => o.id === context)?.name;
    return recentCollaborations.filter((c) => c.organizationName === orgName);
  }, [context]);

  const filteredNotifications = useMemo(
    () => (context === 'all' ? notifications : notifications.filter((item) => item.contextId === context)),
    [context],
  );

  const identitySummary = useMemo(() => {
    if (context === 'all') return dashboard.identitySummary;
    const organization = myOrganizations.find((item) => item.id === context);
    if (!organization) return dashboard.identitySummary;
    return {
      organizationCount: 1,
      departmentCount: organization.departments.split('·').length - 1,
      projectCount: organization.projectCount,
      externalCollabCount: organization.memberType === 'external' ? 1 : 0,
    };
  }, [context, dashboard.identitySummary]);

  return (
    <UserShell
      navItems={userNav}
      accountLabel={currentUser.displayName}
      accountInitials={currentUser.avatarInitials}
    >
      <PageHeader
        title={dashboard.greeting}
        subtitle="汇总查看你在不同组织中的身份与近期协作"
        showNotification
        notificationItems={filteredNotifications}
      />
      <section className={styles.identity}>
        <div>
          <p className={styles.eyebrow}>跨组织身份</p>
          <h2 className={styles.identityTitle}>{currentUser.displayName}的协作全景</h2>
          <p className={styles.identityDesc}>账号状态独立于任何单一组织；下方内容按协作上下文过滤。</p>
          <span className={styles.statusPill}>{dashboard.accountStatusLabel}</span>
        </div>
        <ContextSelector options={dashboard.contextOptions} value={context} onChange={setContext} />
        <div className={styles.summaryGrid}>
          <div>
            <strong>{identitySummary.organizationCount}</strong>
            <span>组织</span>
          </div>
          <div>
            <strong>{identitySummary.departmentCount}</strong>
            <span>部门</span>
          </div>
          <div>
            <strong>{identitySummary.projectCount}</strong>
            <span>项目</span>
          </div>
          <div>
            <strong>{identitySummary.externalCollabCount}</strong>
            <span>外部协作</span>
          </div>
        </div>
      </section>
      <div className={styles.lower}>
        <section className={styles.orgsPanel}>
          <h2 className={styles.panelTitle}>我的组织</h2>
          <p className={styles.panelMeta}>
            {filteredOrgs.length} 个组织 · {identitySummary.departmentCount} 个部门
          </p>
          <div className={styles.orgCards}>
            {filteredOrgs.map((org) => (
              <article key={org.id} className={styles.orgCard}>
                <span className={styles.orgMark} />
                <div className={styles.orgBody}>
                  <p className={styles.orgName}>{org.name}</p>
                  <p className={styles.orgDept}>{org.departments}</p>
                </div>
                <div className={styles.orgAside}>
                  <p>{memberTypeLabels[org.memberType]}</p>
                  <p>{org.projectCount} 个项目</p>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.note}>组织关系彼此独立，不默认指定“主要组织”。</p>
        </section>
        <section className={styles.collabPanel}>
          <div className={styles.collabHeader}>
            <h2 className={styles.panelTitle}>近期协作</h2>
            <button type="button" className={styles.link} onClick={() => navigate('/user/collaboration')}>
              全部协作
            </button>
          </div>
          <ul className={styles.collabList}>
            {filteredCollabs.map((item) => (
              <li key={item.id} className={styles.collabItem}>
                <span className={styles.projectCode}>{item.code}</span>
                <div>
                  <p className={styles.projectName}>{item.name}</p>
                  <p className={styles.projectOrg}>{item.organizationName}</p>
                  <p className={styles.projectMeta}>{item.meta}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className={styles.note}>切换顶部协作上下文后，项目与通知同步过滤。</p>
        </section>
      </div>
    </UserShell>
  );
}
