import { useMemo, useState } from 'react';
import { AdminShell } from '../../../components/layout/AdminShell';
import { PageHeader } from '../../../components/layout/PageHeader';
import { DataTable } from '../../../components/prototype/DataTable/DataTable';
import { auditLogs } from '../../../fixtures/audit.fixture';
import { adminUser } from '../../../fixtures/auth.fixture';
import type { AuditLog } from '../../../types/audit';
import { Button, Input, StatusBadge } from '../../../components/ui';
import styles from './AdminAuditPage.module.css';

const adminNav = [
  { to: '/admin/overview', label: '管理概览' },
  { to: '/admin/users', label: '用户' },
  { to: '/admin/organization', label: '组织与协作' },
  { to: '/admin/audit', label: '审计日志', end: true },
];

export function AdminAuditPage() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<'all' | AuditLog['result']>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const filteredLogs = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return auditLogs.filter(
      (log) =>
        (result === 'all' || log.result === result) &&
        (!normalized ||
          log.actorUsername.toLowerCase().includes(normalized) ||
          log.action.toLowerCase().includes(normalized) ||
          log.targetLabel.toLowerCase().includes(normalized)),
    );
  }, [keyword, result]);

  const columns = [
    { key: 'time', header: '时间', render: (row: AuditLog) => row.occurredAt },
    { key: 'actor', header: '操作者', render: (row: AuditLog) => row.actorUsername },
    { key: 'action', header: '动作', render: (row: AuditLog) => row.action },
    { key: 'target', header: '对象', render: (row: AuditLog) => row.targetLabel },
    {
      key: 'result',
      header: '结果',
      render: (row: AuditLog) => (
        <StatusBadge
          label={row.result === 'success' ? '成功' : row.result === 'denied' ? '拒绝' : '失败'}
          variant={row.result === 'success' ? 'success' : 'denied'}
        />
      ),
    },
    { key: 'ip', header: '来源 IP', render: (row: AuditLog) => row.sourceIp },
  ];

  return (
    <AdminShell navItems={adminNav} accountLabel={adminUser.displayName}>
      <PageHeader title="审计日志" subtitle="所有账号、组织关系与权限治理动作均可追溯" />
      <div className={styles.toolbar}>
        <Input
          placeholder="搜索操作者、动作或对象"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <Button variant="secondary" aria-expanded={filterOpen} onClick={() => setFilterOpen((value) => !value)}>
          筛选{result === 'all' ? '' : ` · ${result === 'success' ? '成功' : result === 'denied' ? '拒绝' : '失败'}`}
        </Button>
        {filterOpen ? (
          <select
            className={styles.filterSelect}
            aria-label="审计结果筛选"
            value={result}
            onChange={(event) => setResult(event.target.value as 'all' | AuditLog['result'])}
          >
            <option value="all">全部结果</option>
            <option value="success">成功</option>
            <option value="denied">拒绝</option>
            <option value="failed">失败</option>
          </select>
        ) : null}
      </div>
      <DataTable columns={columns} rows={filteredLogs} getRowKey={(row) => row.id} />
      <p className={styles.note}>审计日志只读，默认长期保留；导出能力由部署方配置。</p>
    </AdminShell>
  );
}
