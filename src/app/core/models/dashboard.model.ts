export interface DashboardOverview {
  total_contacts: string;
  active_contacts: string;
  contacted_last_7_days: string;
  contacted_last_30_days: string;
  total_messages: string;
  messages_last_7_days: string;
  messages_last_30_days: string;
}

export interface DailyActivity {
  date: string;
  messages_sent: string;
  unique_contacts: string;
}

export interface TopTag {
  tag: string;
  count: string;
}

export interface EngagementMetrics {
  avg_messages_per_contact: string;
  max_messages_to_contact: string;
  one_time_contacts: string;
  repeat_contacts: string;
  repeat_contact_rate: string;
}

export interface WeeklyGrowth {
  week_start: string;
  new_contacts: string;
}

export interface ContactsByStatus {
  status: string;
  count: string;
}
