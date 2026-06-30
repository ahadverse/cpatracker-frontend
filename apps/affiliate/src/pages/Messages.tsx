import { useEffect, useState } from 'react';
import { demoAffiliate, getOwnThread, markThreadRead, sendMessage, type OwnThread } from '@cpatracker/mock';
import { Skeleton, toast } from '@cpatracker/ui';

export function Messages() {
  const [thread, setThread] = useState<OwnThread | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  async function load() {
    const own = await getOwnThread(demoAffiliate.id);
    setThread(own);
    const hasUnread = own.messages.some((m) => m.recipientId === demoAffiliate.id && m.readAt === null);
    if (hasUnread) await markThreadRead(own.threadId, demoAffiliate.id);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSend() {
    if (!thread || reply.trim().length === 0) return;
    setSending(true);
    try {
      await sendMessage(thread.threadId, thread.otherPartyUserId, reply.trim(), demoAffiliate.id);
      setReply('');
      await load();
      toast.success('Message sent');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Messages</h1>

      <div className="flex h-[60vh] flex-col gap-4 rounded-lg border border-border bg-card p-4">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {!thread && <Skeleton className="h-full" />}
          {thread?.messages.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet — send one to the network admin.</p>
          )}
          {thread?.messages.map((message) => {
            const fromMe = message.senderId === demoAffiliate.id;
            return (
              <div
                key={message.id}
                className={
                  fromMe
                    ? 'ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'
                    : 'max-w-[85%] rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground'
                }
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
            placeholder="Write a message to the network admin..."
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
    </div>
  );
}
