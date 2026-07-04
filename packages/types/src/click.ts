export interface SubIds {
  s1?: string;
  s2?: string;
  s3?: string;
  s4?: string;
  s5?: string;
  s6?: string;
  s7?: string;
  s8?: string;
}

export type ClickQualityStatus = 'VALID' | 'SUSPICIOUS' | 'BOT' | 'PROXY' | 'DUPLICATE';
export type ClickOS = 'WINDOWS' | 'MACOS' | 'IOS' | 'ANDROID' | 'LINUX';

export interface Click {
  id: string;
  offerId: string;
  affiliateId: string;
  geo: string;
  device: 'DESKTOP' | 'MOBILE' | 'TABLET';
  os: ClickOS;
  smartLinkId?: string;
  asn: string;
  isUnique: boolean;
  qualityStatus: ClickQualityStatus;
  subIds: SubIds;
  createdAt: string;
}
