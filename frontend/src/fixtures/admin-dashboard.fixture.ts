import type { AdminDashboard } from '../types/auth';

export const adminDashboard: AdminDashboard = {
  stats: {
    activeUsers: { value: 128, delta: '+12 本月' },
    organizations: { value: 4, label: '治理主体' },
    projects: { value: 16, label: '跨组织 3' },
    alerts: { value: 2, label: '近 24 小时' },
  },
  recentActivities: [
    { id: '1', type: '创建账号', description: '林屿已加入澄海工业智能研究院', time: '10:24' },
    { id: '2', type: '关系更新', description: '周岚加入 P100 控制器安全升级', time: '09:42' },
    { id: '3', type: '账号停用', description: '陈默的外部协作已到期', time: '昨天' },
    { id: '4', type: '组织调整', description: '智造技术中心新增嵌入式部门', time: '昨天' },
  ],
  governanceHealth: {
    score: 92,
    items: [
      '126 个账号状态正常',
      '2 个外部成员即将到期',
      '近 7 日无高风险操作',
    ],
    note: '保持组织关系清晰，比增加更多角色更重要。',
  },
};
