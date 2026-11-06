export type MessageStatus = 'Unread' | 'Read' | 'Archived';

export interface AdminContactMessageDto {
  id: string;
  senderName: string;
  senderEmail: string;
  subject?: string;
  messageBody: string;
  status: MessageStatus;
  ipHash?: string;
  userAgent?: string;
  createdAtUtc: string;
  readAtUtc?: string;
}

