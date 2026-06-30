import type { NetworkSettings } from '@cpatracker/types';

// Singleton in-memory record — there is only ever one network's settings.
export const networkSettings: NetworkSettings = {
  defaultCurrency: 'USD',
  defaultHoldDays: 7,
  postbackRetryCount: 3,
  rateLimitPerMinute: 600,
  ipAllowlist: [],
  smtpHost: 'smtp.cpatracker.dev',
  smtpPort: 587,
  smtpUser: 'notifications@cpatracker.dev',
  fromEmail: 'notifications@cpatracker.dev',
};
