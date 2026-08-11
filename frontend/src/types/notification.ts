export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
  contextId?: string;
}
