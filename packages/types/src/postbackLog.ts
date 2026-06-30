export type PostbackStatus = 'SUCCESS' | 'FAILED';

export interface PostbackLog {
  id: string;
  conversionId: string;
  offerId: string;
  url: string;
  status: PostbackStatus;
  responseCode: number;
  attemptedAt: string;
}
