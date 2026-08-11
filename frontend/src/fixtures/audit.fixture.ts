import type { AuditLog } from '../types/audit';

export const auditLogs: AuditLog[] = [
  {
    id: '1',
    occurredAt: '今天 10:24',
    actorUsername: 'admin',
    action: '创建账号',
    targetLabel: '用户 / 林屿',
    result: 'success',
    sourceIp: '10.2.8.14',
  },
  {
    id: '2',
    occurredAt: '今天 09:42',
    actorUsername: 'admin',
    action: '添加项目成员',
    targetLabel: 'P100 控制器安全升级 / 周岚',
    result: 'success',
    sourceIp: '10.2.8.14',
  },
  {
    id: '3',
    occurredAt: '昨天 18:06',
    actorUsername: 'admin',
    action: '停用账号',
    targetLabel: '用户 / 郭启',
    result: 'success',
    sourceIp: '10.2.8.14',
  },
  {
    id: '4',
    occurredAt: '昨天 16:31',
    actorUsername: 'admin',
    action: '变更组织关系',
    targetLabel: '智造技术中心 / 嵌入式系统部',
    result: 'success',
    sourceIp: '10.2.8.14',
  },
  {
    id: '5',
    occurredAt: '08-09 14:18',
    actorUsername: 'admin',
    action: '登录失败',
    targetLabel: '系统登录',
    result: 'denied',
    sourceIp: '172.18.0.9',
  },
];
