export type NewsStatus = 'DRAFT' | 'PUBLISHED';

export const NEWS_CATEGORIES = ['Announcement', 'Product', 'Payments', 'Offers', 'Compliance'] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export interface NewsPost {
  id: string;
  title: string;
  body: string; // rich-text HTML
  thumbnailUrl?: string;
  category?: NewsCategory;
  status: NewsStatus;
  publishedAt: string;
}
