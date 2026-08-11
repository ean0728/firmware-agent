import type { UserListItem } from '../types/user';

export const users: UserListItem[] = [
  {
    id: 'user-linyu',
    username: 'linyu',
    displayName: '林屿',
    status: 'active',
    memberType: 'internal',
    avatarInitials: '林屿',
    organizations: ['澄海工业智能研究院'],
    createdAt: '2026-01-10',
  },
  {
    id: 'user-zhoulan',
    username: 'zhoulan',
    displayName: '周岚',
    status: 'active',
    memberType: 'internal',
    avatarInitials: '周岚',
    organizations: ['集团研究院'],
    projects: ['P100'],
    createdAt: '2026-01-12',
  },
  {
    id: 'user-chenmo',
    username: 'chenmo',
    displayName: '陈默',
    status: 'active',
    memberType: 'external',
    expiresAt: '2026-08-18',
    avatarInitials: '陈默',
    organizations: ['北辰联合实验室'],
    createdAt: '2026-02-01',
  },
  {
    id: 'user-guoqi',
    username: 'guoqi',
    displayName: '郭启',
    status: 'disabled',
    memberType: 'internal',
    avatarInitials: '郭启',
    organizations: ['智造技术中心'],
    createdAt: '2025-11-20',
  },
];

export const memberTypeLabels: Record<string, string> = {
  internal: '内部成员',
  external: '外部协作',
};

export const statusLabels: Record<string, { label: string; variant: 'active' | 'expiring' | 'disabled' }> = {
  active: { label: '正常', variant: 'active' },
  pending: { label: '待激活', variant: 'expiring' },
  suspended: { label: '即将到期', variant: 'expiring' },
  disabled: { label: '已停用', variant: 'disabled' },
};

export function getUserStatusDisplay(user: UserListItem) {
  if (user.memberType === 'external' && user.expiresAt) {
    return { label: '即将到期', variant: 'expiring' as const };
  }
  if (user.status === 'disabled') {
    return { label: '已停用', variant: 'disabled' as const };
  }
  return { label: '正常', variant: 'active' as const };
}
