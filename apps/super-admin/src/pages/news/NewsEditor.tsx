import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNews, getNewsPost, updateNews } from '@cpatracker/mock';
import { NEWS_CATEGORIES, type NewsCategory, type NewsStatus } from '@cpatracker/types';
import { FileUpload, Input, RichText, Select, Skeleton, toast } from '@cpatracker/ui';

const CATEGORY_OPTIONS = NEWS_CATEGORIES.map((c) => ({ value: c, label: c }));
const STATUS_OPTIONS: { value: NewsStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
];

export function NewsEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();
  const [category, setCategory] = useState<NewsCategory>();
  const [status, setStatus] = useState<NewsStatus>('DRAFT');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getNewsPost(id).then((post) => {
      if (post) {
        setTitle(post.title);
        setBody(post.body);
        setThumbnailUrl(post.thumbnailUrl);
        setCategory(post.category);
        setStatus(post.status);
      }
      setLoading(false);
    });
  }, [id]);

  const bodyHasText = body.replace(/<[^>]*>/g, '').trim().length > 0;
  const valid = title.trim().length > 0 && bodyHasText;

  async function handleSave() {
    if (!valid) return;
    setSaving(true);
    try {
      const input = { title: title.trim(), body, thumbnailUrl, category, status };
      if (id) {
        await updateNews(id, input);
        toast.success('Post updated');
      } else {
        await createNews(input);
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
          <label className="text-sm font-medium text-foreground">Thumbnail</label>
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="" className="max-h-40 w-full rounded-md border border-border object-cover" />
          )}
          <FileUpload
            accept="image/*"
            onFilesSelected={(files) => {
              const file = files[0];
              if (file) setThumbnailUrl(URL.createObjectURL(file));
            }}
          />
          {thumbnailUrl && (
            <button
              type="button"
              onClick={() => setThumbnailUrl(undefined)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Remove thumbnail
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select
              options={CATEGORY_OPTIONS}
              value={category}
              onValueChange={(value) => setCategory(value as NewsCategory)}
              placeholder="Select a category"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onValueChange={(value) => setStatus(value as NewsStatus)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Body</label>
          <RichText defaultValue={body} onValueChange={setBody} placeholder="Post body" />
        </div>

        <button
          type="button"
          disabled={!valid || saving}
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create post'}
        </button>
      </div>
    </div>
  );
}
