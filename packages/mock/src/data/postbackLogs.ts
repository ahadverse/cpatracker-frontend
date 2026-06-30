import type { PostbackLog } from '@cpatracker/types';
import { faker } from '../faker';
import { conversions } from './conversions';

export const postbackLogs: PostbackLog[] = conversions
  .filter((conversion) => conversion.status === 'APPROVED')
  .map((conversion, i) => {
    const success = faker.datatype.boolean(0.85);
    return {
      id: `postback-${i + 1}`,
      conversionId: conversion.id,
      offerId: conversion.offerId,
      url: `https://advertiser.example.com/postback?txn=${conversion.txnId ?? conversion.id}&payout=${conversion.payout}`,
      status: success ? 'SUCCESS' : 'FAILED',
      responseCode: success ? 200 : faker.helpers.arrayElement([400, 404, 500, 502, 504]),
      attemptedAt: faker.date.recent({ days: 28 }).toISOString(),
    };
  });
