export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}
