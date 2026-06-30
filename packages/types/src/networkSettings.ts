export interface NetworkSettings {
  defaultCurrency: string;
  defaultHoldDays: number;
  postbackRetryCount: number;
  rateLimitPerMinute: number;
  ipAllowlist: string[];
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  fromEmail: string;
}
