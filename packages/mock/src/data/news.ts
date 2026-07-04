import type { NewsPost } from '@cpatracker/types';
import { NEWS_CATEGORIES } from '@cpatracker/types';
import { faker } from '../faker';

const COUNT = 8;

export const news: NewsPost[] = Array.from({ length: COUNT }, (_, i) => {
  const paragraphs = faker.lorem.paragraphs({ min: 1, max: 3 }, '\n');
  return {
    id: `news-${i + 1}`,
    title: faker.company.catchPhrase(),
    // Rich-text HTML body (each paragraph wrapped in <p>).
    body: paragraphs
      .split('\n')
      .map((p) => `<p>${p}</p>`)
      .join(''),
    thumbnailUrl: `https://picsum.photos/seed/news-${i + 1}/640/360`,
    category: faker.helpers.arrayElement(NEWS_CATEGORIES),
    // Keep the two most recent posts as drafts to exercise the visibility rule.
    status: i < 2 ? 'DRAFT' : 'PUBLISHED',
    publishedAt: faker.date.recent({ days: 90 }).toISOString(),
  };
});
