import { useEffect, useState } from 'react';
import {
  adminUser,
  getMessageThreads,
  getMessages,
  markThreadRead,
  sendMessage,
  type MessageParticipantRole,
  type MessageThread,
} from '@cpatracker/mock';
import type { Message } from '@cpatracker/types';
import { Drawer, Skeleton, StatusBadge, toast } from '@cpatracker/ui';

export interface MessagesPageProps {
  title: string;
  role: MessageParticipantRole;
}

export function MessagesPage({ title, role }: MessagesPageProps) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    setThreads(await getMessageThreads(role));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [role]);

  async function openThread(thread: MessageThread) {
    setActiveThread(thread);
    setActiveMessages(await getMessages(thread.threadId));
    if (thread.unreadCount > 0) {
      await markThreadRead(thread.threadId);
      load();
    }
  }

  async function handleSend() {
    if (!activeThread || reply.trim().length === 0) return;
    setSending(true);
    try {
      await sendMessage(activeThread.threadId, activeThread.participantUserId, reply.trim());
      setReply('');
      setActiveMessages(await getMessages(activeThread.threadId));
      toast.success('Message sent');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {loading &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </div>
          ))}
        {!loading && threads.length === 0 && <p className="p-4 text-sm text-muted-foreground">No conversations.</p>}
        {threads.map((thread) => (
          <button
            key={thread.threadId}
            type="button"
            onClick={() => openThread(thread)}
            className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="min-w-0">
              <p className="font-medium text-card-foreground">{thread.participantName}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">{thread.lastMessage.body}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(thread.lastMessage.createdAt).toLocaleDateString()}</span>
              {thread.unreadCount > 0 && <StatusBadge variant="info">{thread.unreadCount}</StatusBadge>}
            </div>
          </button>
        ))}
      </div>

      <Drawer open={!!activeThread} onOpenChange={(open) => !open && setActiveThread(null)} title={activeThread?.participantName}>
        <div className="flex h-full flex-col gap-4">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {activeMessages.map((message) => {
              const fromAdmin = message.senderId === adminUser.id;
              return (
                <div
                  key={message.id}
                  className={fromAdmin ? 'ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground' : 'max-w-[85%] rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground'}
                >
                  <p>{message.body}</p>
                  <p className="mt-1 text-xs opacity-70">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              disabled={reply.trim().length === 0 || sending}
              onClick={handleSend}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
