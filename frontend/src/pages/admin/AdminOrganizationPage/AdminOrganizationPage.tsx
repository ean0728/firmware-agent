import { useState } from 'react';
import { AdminShell } from '../../../components/layout/AdminShell';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Drawer } from '../../../components/prototype/Drawer/Drawer';
import { Tabs } from '../../../components/prototype/Tabs/Tabs';
import { adminUser } from '../../../fixtures/auth.fixture';
import { defaultSelectedOrgId, organizations, orgUnitsByOrg } from '../../../fixtures/organizations.fixture';
import { Button, Input } from '../../../components/ui';
import styles from './AdminOrganizationPage.module.css';

const adminNav = [
  { to: '/admin/overview', label: '管理概览' },
  { to: '/admin/users', label: '用户' },
  { to: '/admin/organization', label: '组织与协作', end: true },
  { to: '/admin/audit', label: '审计日志' },
];

const tabs = [
  { id: 'org', label: '组织' },
  { id: 'dept', label: '部门', disabled: true },
  { id: 'project', label: '项目', disabled: true },
];

export function AdminOrganizationPage() {
  const [activeTab, setActiveTab] = useState('org');
  const [selectedOrgId, setSelectedOrgId] = useState(defaultSelectedOrgId);
  const [keyword, setKeyword] = useState('');
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | null>(null);

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId) ?? organizations[0];
  const orgUnits = orgUnitsByOrg[selectedOrg.id] ?? [];
  const filteredOrgs = organizations.filter((o) => o.name.includes(keyword));

  return (
    <AdminShell navItems={adminNav} accountLabel={adminUser.displayName}>
      <PageHeader
        title="组织与协作"
        subtitle="在同一空间维护组织、部门、项目及其成员关系"
        action={<Button onClick={() => setDrawerMode('create')}>新建组织</Button>}
      />
      <Tabs items={tabs} activeId={activeTab} onChange={setActiveTab} />
      {activeTab === 'org' ? (
        <div className={styles.layout}>
          <section className={styles.listPanel}>
            <p className={styles.count}>{organizations.length} 个组织</p>
            <Input
              placeholder="搜索组织"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <div className={styles.orgList}>
              {filteredOrgs.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  className={`${styles.orgCard} ${org.id === selectedOrg.id ? styles.orgSelected : ''}`}
                  onClick={() => setSelectedOrgId(org.id)}
                >
                  <span className={styles.orgMark} />
                  <div>
                    <p className={styles.orgName}>{org.name}</p>
                    <p className={styles.orgMeta}>
                      {org.memberCount} 人 · {org.departmentCount} 部门
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
          <section className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <div>
                <h2 className={styles.detailTitle}>{selectedOrg.name}</h2>
                <p className={styles.detailCode}>组织编码 · {selectedOrg.code}</p>
              </div>
              <Button variant="secondary" onClick={() => setDrawerMode('edit')}>
                编辑组织
              </Button>
            </div>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <p>成员</p>
                <strong>{selectedOrg.memberCount}</strong>
              </div>
              <div className={styles.metric}>
                <p>部门</p>
                <strong>{selectedOrg.departmentCount}</strong>
              </div>
              <div className={styles.metric}>
                <p>项目</p>
                <strong>{selectedOrg.projectCount}</strong>
              </div>
            </div>
            <h3 className={styles.treeTitle}>组织结构</h3>
            <ul className={styles.tree}>
              {orgUnits.map((unit, index) => (
                <li key={unit.id} className={styles.treeItem}>
                  <span className={`${styles.deptDot} ${index === 0 ? styles.deptDotAccent : ''}`} />
                  <span className={styles.deptName}>{unit.name}</span>
                  <span className={styles.deptMeta}>
                    {unit.memberCount} 人 · {unit.projectCount} 项目
                  </span>
                </li>
              ))}
            </ul>
            <p className={styles.footerNote}>组织拥有知识与治理边界；项目仅作为协作和授权主体。</p>
          </section>
        </div>
      ) : null}
      <Drawer
        open={drawerMode !== null}
        title={drawerMode === 'edit' ? '编辑组织' : '新建组织'}
        subtitle={drawerMode === 'edit' ? `维护 ${selectedOrg.name} 的基础信息` : '创建新的组织治理边界'}
        onClose={() => setDrawerMode(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerMode(null)}>
              取消
            </Button>
            <Button onClick={() => setDrawerMode(null)}>保存</Button>
          </>
        }
      >
        <div className={styles.drawerForm}>
          <Input
            label="组织名称"
            placeholder="组织名称"
            defaultValue={drawerMode === 'edit' ? selectedOrg.name : ''}
          />
          <Input
            label="组织编码"
            placeholder="ORG-XXX-001"
            defaultValue={drawerMode === 'edit' ? selectedOrg.code : ''}
          />
          <p>当前视觉原型仅提供本地打开、编辑与关闭反馈，不持久化组织数据。</p>
        </div>
      </Drawer>
    </AdminShell>
  );
}
