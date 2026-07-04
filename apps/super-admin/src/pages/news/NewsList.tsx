import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { deleteNews, getNews } from '@cpatracker/mock';
import type { NewsPost } from '@cpatracker/types';
import { DataTable, toast } from '@cpatracker/ui';

export function NewsList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setPosts(await getNews());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(post: NewsPost) {
    await deleteNews(post.id);
    toast.success('Post deleted');
    load();
  }

  const columns: ColumnDef<NewsPost>[] = [
    { accessorKey: 'title', header: 'Title' },
    {
      id: 'publishedAt',
      header: 'Published',
      accessorFn: (post) => new Date(post.publishedAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/news/${row.original.id}`)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.original)}
            className="rounded-md border border-destructive px-2 py-1 text-xs text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">News</h1>
        <button
          type="button"
          onClick={() => navigate('/news/create')}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + New Post
        </button>
      </div>

      <DataTable columns={columns} data={posts} loading={loading} emptyState="No news posts yet." />
    </div>
  );
}
