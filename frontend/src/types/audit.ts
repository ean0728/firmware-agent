export interface AuditLog {
  id: string;
  occurredAt: string;
  actorUsername: string;
  action: string;
  targetLabel: string;
  result: 'success' | 'denied' | 'failed';
  sourceIp: string;
}
