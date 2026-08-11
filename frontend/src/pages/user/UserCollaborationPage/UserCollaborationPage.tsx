import { useMemo, useState } from 'react';
import { UserShell } from '../../../components/layout/UserShell';
import { PageHeader } from '../../../components/layout/PageHeader';
import { FilterChips } from '../../../components/prototype/FilterChips/FilterChips';
import { RelationshipDetailPanel } from '../../../components/prototype/RelationshipDetailPanel/RelationshipDetailPanel';
import { RelationshipTree } from '../../../components/prototype/RelationshipTree/RelationshipTree';
import { currentUser } from '../../../fixtures/auth.fixture';
import {
  collaborationTree,
  defaultSelectedDetail,
  membershipSummary,
} from '../../../fixtures/collaboration.fixture';
import type { CollaborationNode, RelationshipDetail } from '../../../types/collaboration';
import { Input } from '../../../components/ui';
import styles from './UserCollaborationPage.module.css';

const userNav = [
  { to: '/user/overview', label: '概览' },
  { to: '/user/collaboration', label: '我的协作', end: true },
];

export function UserCollaborationPage() {
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('全部');
  const [selectedId, setSelectedId] = useState<string | null>('p100');
  const [detail, setDetail] = useState<RelationshipDetail | null>(defaultSelectedDetail);

  const filteredTree = useMemo(() => {
    return collaborationTree.filter((node) => {
      const matchKeyword =
        !keyword ||
        node.name.includes(keyword) ||
        node.children?.some((c) => c.name.includes(keyword));
      const matchFilter =
        filter === '全部' ||
        (filter === '内部' && node.memberType !== 'external') ||
        (filter === '外部' && node.memberType === 'external');
      return matchKeyword && matchFilter;
    });
  }, [filter, keyword]);

  const onSelect = (node: CollaborationNode, nodeDetail: RelationshipDetail | null) => {
    setSelectedId(node.id);
    setDetail(nodeDetail);
  };

  return (
    <UserShell
      navItems={userNav}
      accountLabel={currentUser.displayName}
      accountInitials={currentUser.avatarInitials}
    >
      <PageHeader title="我的协作" subtitle="按组织查看部门、项目与外部协作关系" showNotification />
      <section className={styles.summary}>
        <div>
          <p>参与组织</p>
          <strong>{membershipSummary.organizations}</strong>
        </div>
        <div>
          <p>所属部门</p>
          <strong>{membershipSummary.departments}</strong>
        </div>
        <div>
          <p>参与项目</p>
          <strong>{membershipSummary.projects}</strong>
        </div>
        <div>
          <p>外部协作</p>
          <strong>{membershipSummary.external}</strong>
        </div>
      </section>
      <div className={styles.workspace}>
        <section className={styles.treePanel}>
          <h2 className={styles.panelTitle}>关系视图</h2>
          <div className={styles.toolbar}>
            <Input
              placeholder="搜索组织、部门或项目"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <FilterChips options={['全部', '内部', '外部']} value={filter} onChange={setFilter} />
          </div>
          <RelationshipTree nodes={filteredTree} selectedId={selectedId} onSelect={onSelect} />
          <p className={styles.note}>按组织展开关系；用户侧只读，关系由管理员维护。</p>
        </section>
        <RelationshipDetailPanel detail={detail} />
      </div>
    </UserShell>
  );
}
