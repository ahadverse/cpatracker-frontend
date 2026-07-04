import { useEffect, useState } from 'react';
import { getNews } from '@cpatracker/mock';
import type { NewsPost } from '@cpatracker/types';
import { Skeleton } from '@cpatracker/ui';

export function News() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews().then((rows) => {
      setPosts(rows);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">News</h1>

      <div className="space-y-4">
        {loading && Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-32" />)}
        {!loading && posts.length === 0 && <p className="text-sm text-muted-foreground">No news yet.</p>}
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-card-foreground">{post.title}</h2>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
