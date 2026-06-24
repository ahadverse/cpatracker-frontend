export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  readAt: string | null;
  createdAt: string;
}
