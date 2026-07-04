import { useState } from 'react';
import { Calendar, Newspaper } from 'lucide-react';
import type { NewsPost } from '@cpatracker/types';
import { cn } from '../lib/cn';
import { Modal } from './Modal';
import { Skeleton } from './Skeleton';
import { StatusBadge } from './StatusBadge';

export interface NewsGridProps {
  posts: NewsPost[];
  loading?: boolean;
  className?: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function NewsGrid({ posts, loading = false, className }: NewsGridProps) {
  const [active, setActive] = useState<NewsPost | null>(null);

  if (loading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">No news yet.</p>;
  }

  return (
    <>
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setActive(post)}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <Newspaper className="size-8" />
                </div>
              )}
              {post.category && (
                <span className="absolute left-2 top-2">
                  <StatusBadge variant="info">{post.category}</StatusBadge>
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                {formatDate(post.publishedAt)}
              </div>
              <h3 className="line-clamp-2 text-base font-semibold text-card-foreground">{post.title}</h3>
              <p className="line-clamp-3 text-sm text-muted-foreground">{stripHtml(post.body)}</p>
            </div>
          </button>
        ))}
      </div>

      <Modal open={active !== null} onOpenChange={(o) => !o && setActive(null)} title={active?.title}>
        {active && (
          <div className="space-y-4">
            {active.thumbnailUrl && (
              <img src={active.thumbnailUrl} alt="" className="max-h-56 w-full rounded-md object-cover" />
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {formatDate(active.publishedAt)}
              </span>
              {active.category && <StatusBadge variant="info">{active.category}</StatusBadge>}
            </div>
            <div
              className="max-h-[50vh] overflow-y-auto text-sm text-muted-foreground [&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: active.body }}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
