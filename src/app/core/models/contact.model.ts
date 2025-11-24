export interface Contact {
  id: number;
  phone_number: string;
  phone_number_formatted: string;
  first_contact_date: string;
  last_contact_date: string;
  contact_count: number;
  last_message_sent: string;
  status: 'active' | 'inactive' | 'blocked';
  notes: string | null;
  tags: string[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  contact_id: number;
  message_sid: string;
  phone_number: string;
  message_body: string;
  pdf_url: string | null;
  status: string;
  twilio_status: string;
  sent_at: string;
  tags?: string[];
}
