export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  time: string;
}

export interface AdminDashboard {
  stats: {
    activeUsers: { value: number; delta: string };
    organizations: { value: number; label: string };
    projects: { value: number; label: string };
    alerts: { value: number; label: string };
  };
  recentActivities: ActivityItem[];
  governanceHealth: {
    score: number;
    items: string[];
    note: string;
  };
}
