import { useEffect, useState } from 'react';
import { getNews } from '@cpatracker/mock';
import type { NewsPost } from '@cpatracker/types';
import { NewsGrid } from '@cpatracker/ui';

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
      <NewsGrid posts={posts} loading={loading} />
    </div>
  );
}
