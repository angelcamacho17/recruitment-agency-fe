export interface Email {
  id: number;
  email: string;
  name: string;
  email_count: number;
  first_contact_date: string;
  last_contact_date: string;
  last_subject_sent: string;
  tags: string[];
  status: 'active' | 'inactive' | 'blocked';
}

export interface EmailsResponse {
  success: boolean;
  emails: Email[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface EmailSearchCriteria {
  email?: string;
  name?: string;
  tags?: string[];
  minEmailCount?: number;
}

export interface EmailSearchResponse {
  success: boolean;
  count: number;
  emails: Email[];
  error?: string;
}

export interface EmailStatistics {
  total_emails: number;
  active_emails: number;
  total_emails_sent: number;
  contacted_last_7_days: number;
  contacted_last_30_days: number;
}

export interface EmailStatisticsResponse {
  success: boolean;
  statistics: EmailStatistics;
  error?: string;
}
