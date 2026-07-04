import type { NewsPost } from '@cpatracker/types';
import { faker } from '../faker';

const COUNT = 8;

export const news: NewsPost[] = Array.from({ length: COUNT }, (_, i) => ({
  id: `news-${i + 1}`,
  title: faker.company.catchPhrase(),
  body: faker.lorem.paragraphs({ min: 1, max: 3 }, '\n\n'),
  publishedAt: faker.date.recent({ days: 90 }).toISOString(),
}));
