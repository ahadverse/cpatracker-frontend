import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNews, getNewsPost, updateNews } from '@cpatracker/mock';
import { Input, Skeleton, toast } from '@cpatracker/ui';

export function NewsEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getNewsPost(id).then((post) => {
      if (post) {
        setTitle(post.title);
        setBody(post.body);
      }
      setLoading(false);
    });
  }, [id]);

  const valid = title.trim().length > 0 && body.trim().length > 0;

  async function handleSave() {
    if (!valid) return;
    setSaving(true);
    try {
      if (id) {
        await updateNews(id, { title: title.trim(), body: body.trim() });
        toast.success('Post updated');
      } else {
        await createNews({ title: title.trim(), body: body.trim() });
        toast.success('Post created');
      }
      navigate('/news');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{isEditing ? 'Edit Post' : 'New Post'}</h1>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Post body"
            rows={8}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <button
          type="button"
          disabled={!valid || saving}
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Publish post'}
        </button>
      </div>
    </div>
  );
}
