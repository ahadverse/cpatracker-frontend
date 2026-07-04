import type { Click, ClickOS, ClickQualityStatus, SubIds } from '@cpatracker/types';
import { faker } from '../faker';
import { affiliates } from './affiliates';
import { offers } from './offers';
import { smartLinks } from './smartLinks';

const COUNT = 250;
const QUALITY_STATUSES: ClickQualityStatus[] = ['VALID', 'SUSPICIOUS', 'BOT', 'PROXY', 'DUPLICATE'];
const OS_VALUES: ClickOS[] = ['WINDOWS', 'MACOS', 'IOS', 'ANDROID', 'LINUX'];

function makeSubIds(): SubIds {
  const subIds: SubIds = {};
  const count = faker.number.int({ min: 0, max: 4 });
  for (let i = 0; i < count; i++) {
    subIds[`s${i + 1}` as keyof SubIds] = faker.word.sample();
  }
  return subIds;
}

export const clicks: Click[] = Array.from({ length: COUNT }, (_, i) => {
  const offer = faker.helpers.arrayElement(offers);
  const affiliate = faker.helpers.arrayElement(affiliates);

  return {
    id: `click-${i + 1}`,
    offerId: offer.id,
    affiliateId: affiliate.id,
    geo: faker.location.countryCode(),
    device: faker.helpers.arrayElement(['DESKTOP', 'MOBILE', 'TABLET']),
    os: faker.helpers.arrayElement(OS_VALUES),
    smartLinkId: faker.datatype.boolean(0.3) ? faker.helpers.arrayElement(smartLinks).id : undefined,
    asn: `AS${faker.number.int({ min: 1000, max: 99999 })}`,
    isUnique: faker.datatype.boolean(0.85),
    qualityStatus: faker.helpers.weightedArrayElement([
      { value: QUALITY_STATUSES[0]!, weight: 8 },
      { value: QUALITY_STATUSES[1]!, weight: 1 },
      { value: QUALITY_STATUSES[2]!, weight: 1 },
      { value: QUALITY_STATUSES[3]!, weight: 1 },
      { value: QUALITY_STATUSES[4]!, weight: 1 },
    ]),
    subIds: makeSubIds(),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  };
});
