import { useMemo, useState } from 'react';
import { AdminShell } from '../../../components/layout/AdminShell';
import { PageHeader } from '../../../components/layout/PageHeader';
import { DataTable } from '../../../components/prototype/DataTable/DataTable';
import { Drawer } from '../../../components/prototype/Drawer/Drawer';
import { adminUser } from '../../../fixtures/auth.fixture';
import { getUserStatusDisplay, memberTypeLabels, users as initialUsers } from '../../../fixtures/users.fixture';
import type { MemberType, UserListItem, UserStatus } from '../../../types/user';
import { Avatar, Button, Input, StatusBadge } from '../../../components/ui';
import styles from './AdminUsersPage.module.css';

const adminNav = [
  { to: '/admin/overview', label: '管理概览' },
  { to: '/admin/users', label: '用户', end: true },
  { to: '/admin/organization', label: '组织与协作' },
  { to: '/admin/audit', label: '审计日志' },
];

export function AdminUsersPage() {
  const [keyword, setKeyword] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [memberType, setMemberType] = useState<'all' | MemberType>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    organization: '',
    memberType: 'internal' as MemberType,
    status: 'active' as UserStatus,
  });

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.displayName.includes(keyword) ||
          u.username.includes(keyword) ||
          u.email?.includes(keyword) ||
          u.organizations.some((o) => o.includes(keyword)),
      ).filter((u) => memberType === 'all' || u.memberType === memberType),
    [keyword, memberType, users],
  );

  const createUser = () => {
    if (!form.username.trim() || !form.displayName.trim()) return;
    setUsers((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        username: form.username.trim(),
        displayName: form.displayName.trim(),
        email: form.email.trim() || undefined,
        memberType: form.memberType,
        status: form.status,
        organizations: [form.organization.trim() || '未分配组织'],
        avatarInitials: form.displayName.trim().slice(0, 2),
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setDrawerOpen(false);
    setForm({
      username: '',
      displayName: '',
      email: '',
      organization: '',
      memberType: 'internal',
      status: 'active',
    });
  };

  const columns = [
    {
      key: 'member',
      header: '成员',
      render: (row: UserListItem) => (
        <div className={styles.memberCell}>
          <Avatar initials={row.avatarInitials ?? row.displayName.slice(0, 2)} />
          <div>
            <p className={styles.name}>{row.displayName}</p>
            <p className={styles.username}>@{row.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'org',
      header: '组织 / 协作',
      render: (row: UserListItem) => (
        <span>
          {row.organizations.join(' · ')}
          {row.projects?.length ? ` · ${row.projects[0]}` : ''}
        </span>
      ),
    },
    {
      key: 'type',
      header: '类型',
      render: (row: UserListItem) => memberTypeLabels[row.memberType],
    },
    {
      key: 'status',
      header: '状态',
      render: (row: UserListItem) => {
        const s = getUserStatusDisplay(row);
        return <StatusBadge label={s.label} variant={s.variant} />;
      },
    },
  ];

  return (
    <AdminShell navItems={adminNav} accountLabel={adminUser.displayName}>
      <PageHeader
        title="用户"
        subtitle="由管理员统一创建和维护平台账号"
        action={
          <Button onClick={() => setDrawerOpen(true)}>创建用户</Button>
        }
      />
      <div className={styles.toolbar}>
        <Input
          placeholder="搜索用户名、姓名或邮箱"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button variant="secondary" aria-expanded={filterOpen} onClick={() => setFilterOpen((value) => !value)}>
          筛选{memberType === 'all' ? '' : ` · ${memberTypeLabels[memberType]}`}
        </Button>
        {filterOpen ? (
          <select
            className={styles.filterSelect}
            aria-label="成员类型筛选"
            value={memberType}
            onChange={(event) => setMemberType(event.target.value as 'all' | MemberType)}
          >
            <option value="all">全部成员</option>
            <option value="internal">内部成员</option>
            <option value="external">外部协作</option>
          </select>
        ) : null}
      </div>
      <DataTable columns={columns} rows={filtered} getRowKey={(row) => row.id} />

      <Drawer
        open={drawerOpen}
        title="创建账号"
        subtitle="管理员直接设置登录凭据与初始协作关系"
        onClose={() => setDrawerOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              取消
            </Button>
            <Button onClick={createUser} disabled={!form.username.trim() || !form.displayName.trim()}>
              创建
            </Button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <Input
            label="用户名"
            placeholder="username"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
          />
          <Input
            label="姓名"
            placeholder="姓名"
            value={form.displayName}
            onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
          />
          <Input
            label="邮箱（可选）"
            placeholder="email@example.com"
            className={styles.full}
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <Input label="密码" type="password" />
          <Input label="确认密码" type="password" />
          <Input
            label="所属组织（多选）"
            placeholder="选择组织"
            value={form.organization}
            onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
          />
          <label className={styles.selectField}>
            <span>成员类型</span>
            <select
              value={form.memberType}
              onChange={(event) =>
                setForm((current) => ({ ...current, memberType: event.target.value as MemberType }))
              }
            >
              <option value="internal">内部成员</option>
              <option value="external">外部协作</option>
            </select>
          </label>
          <Input label="所属部门（多选）" placeholder="选择部门" />
          <Input label="所属项目（多选）" placeholder="选择项目" />
          <Input label="有效期" placeholder="长期有效" />
          <label className={styles.selectField}>
            <span>账号状态</span>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value as UserStatus }))
              }
            >
              <option value="active">正常</option>
              <option value="pending">待激活</option>
              <option value="disabled">已停用</option>
            </select>
          </label>
        </div>
        <p className={styles.note}>
          账号创建后即可使用管理员设置的用户名和密码登录。当前原型不提供用户自助修改密码。
        </p>
      </Drawer>
    </AdminShell>
  );
}
