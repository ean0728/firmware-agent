import type { RelationshipDetail } from '../../../types/collaboration';
import styles from './RelationshipDetailPanel.module.css';

interface RelationshipDetailPanelProps {
  detail: RelationshipDetail | null;
}

export function RelationshipDetailPanel({ detail }: RelationshipDetailPanelProps) {
  if (!detail) {
    return (
      <aside
        className={`${styles.panel} subtle-scrollbar`}
        aria-label="关系详情"
        tabIndex={0}
      >
        <p className={styles.empty}>选择组织、部门或项目节点后，此面板展示对应关系详情。</p>
      </aside>
    );
  }

  return (
    <aside
      className={`${styles.panel} subtle-scrollbar`}
      aria-label="关系详情"
      tabIndex={0}
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>关系详情</p>
        <span className={styles.badge}>{detail.nodeType === 'project' ? '项目' : detail.nodeType === 'department' ? '部门' : '组织'}</span>
      </div>
      {detail.code ? <p className={styles.code}>{detail.code}</p> : null}
      <h2 className={styles.title}>{detail.title}</h2>
      {detail.currentContext ? <p className={styles.context}>当前位于：{detail.currentContext}</p> : null}
      <div className={styles.divider} />
      <div className={styles.grid}>
        {detail.homeOrganization ? (
          <div>
            <p className={styles.label}>归属组织</p>
            <p className={styles.value}>{detail.homeOrganization}</p>
          </div>
        ) : null}
        {detail.projectType ? (
          <div>
            <p className={styles.label}>项目类型</p>
            <p className={styles.value}>{detail.projectType}</p>
          </div>
        ) : null}
        {detail.role ? (
          <div>
            <p className={styles.label}>我的角色</p>
            <p className={styles.value}>{detail.role}</p>
          </div>
        ) : null}
        {detail.source ? (
          <div>
            <p className={styles.label}>关系来源</p>
            <p className={styles.value}>{detail.source}</p>
          </div>
        ) : null}
        {detail.collaboratingOrg ? (
          <div className={styles.full}>
            <p className={styles.label}>协作组织</p>
            <p className={styles.value}>{detail.collaboratingOrg}</p>
          </div>
        ) : null}
        {detail.validity ? (
          <div>
            <p className={styles.label}>有效期</p>
            <p className={styles.value}>{detail.validity}</p>
          </div>
        ) : null}
      </div>
      <p className={styles.hint}>选择组织、部门或项目节点后，此面板展示对应关系详情。</p>
    </aside>
  );
}
