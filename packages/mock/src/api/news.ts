import type { NewsPost } from '@cpatracker/types';
import { delay } from '../delay';
import { news } from '../data/news';
import { USE_MOCK } from '../config';

export async function getNews(): Promise<NewsPost[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return [...news].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getNewsPost(id: string): Promise<NewsPost | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return news.find((post) => post.id === id);
}

export interface CreateNewsInput {
  title: string;
  body: string;
}

export async function createNews(input: CreateNewsInput): Promise<NewsPost> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const post: NewsPost = {
    id: `news-${news.length + 1}-${Date.now()}`,
    title: input.title,
    body: input.body,
    publishedAt: new Date().toISOString(),
  };
  news.push(post);
  return post;
}

export interface UpdateNewsInput {
  title: string;
  body: string;
}

export async function updateNews(id: string, input: UpdateNewsInput): Promise<NewsPost> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const post = news.find((p) => p.id === id);
  if (!post) throw new Error(`News post ${id} not found`);
  post.title = input.title;
  post.body = input.body;
  return post;
}

export async function deleteNews(id: string): Promise<void> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const index = news.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`News post ${id} not found`);
  news.splice(index, 1);
}
