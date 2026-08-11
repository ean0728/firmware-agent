import type { NotificationItem } from '../types/notification';

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: '外部协作即将到期',
    description: '陈默在北辰联合实验室的协作将于 7 天后到期',
    time: '今天 09:10',
    unread: true,
    contextId: 'org-bc',
  },
  {
    id: 'n2',
    title: '治理事件待关注',
    description: '近 24 小时有 2 项账号与组织关系变更',
    time: '今天 08:42',
    unread: true,
    contextId: 'org-ch',
  },
  {
    id: 'n3',
    title: '项目成员更新',
    description: '周岚已加入 P100 控制器安全升级',
    time: '昨天 16:20',
    contextId: 'org-group',
  },
];
