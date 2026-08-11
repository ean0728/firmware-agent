import { useState } from 'react';
import type { CollaborationNode, RelationshipDetail } from '../../../types/collaboration';
import styles from './RelationshipTree.module.css';

interface RelationshipTreeProps {
  nodes: CollaborationNode[];
  selectedId: string | null;
  onSelect: (node: CollaborationNode, detail: RelationshipDetail | null) => void;
}

export function RelationshipTree({ nodes, selectedId, onSelect }: RelationshipTreeProps) {
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(nodes.filter((node) => node.expanded).map((node) => node.id)),
  );

  const selectOrganization = (node: CollaborationNode) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
    onSelect(node, node.detail ?? null);
  };

  return (
    <div className={styles.tree}>
      {nodes.map((node) => (
        <div key={node.id} className={styles.orgBlock}>
          <button
            type="button"
            className={`${styles.orgCard} ${selectedId === node.id ? styles.selected : ''}`}
            onClick={() => selectOrganization(node)}
          >
            <span className={styles.orgMark} />
            <div>
              <p className={styles.orgName}>
                {expandedIds.has(node.id) ? '−' : '›'} {node.name}
              </p>
              <p className={styles.orgSummary}>{node.summary}</p>
            </div>
          </button>
          {expandedIds.has(node.id) && node.children?.map((child) => (
            <button
              key={child.id}
              type="button"
              className={`${styles.childRow} ${selectedId === child.id ? styles.childSelected : ''}`}
              onClick={() => onSelect(child, child.detail ?? null)}
            >
              <span className={child.type === 'project' ? styles.projectDot : styles.deptDot} />
              <div>
                <p className={styles.childName}>{child.name}</p>
                <p className={child.summary.includes('跨组织') ? styles.crossOrg : styles.childSummary}>
                  {child.summary}
                </p>
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
