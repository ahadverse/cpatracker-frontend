export type OfferAccessStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OfferAccessRequest {
  id: string;
  offerId: string;
  affiliateId: string;
  status: OfferAccessStatus;
  createdAt: string;
}
