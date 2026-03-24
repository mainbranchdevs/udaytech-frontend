import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTickets, createTicket, sendMessage } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  not_resolved: 'Not Resolved',
  completed: 'Completed',
  open: 'Pending',
};

export default function SupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTickets().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => createTicket({}),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setActiveTicket(res.data.id);
    },
  });

  const sendMutation = useMutation({
    mutationFn: () => sendMessage({ ticket_id: activeTicket!, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setMessage('');
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const active = tickets?.find((t) => t.id === activeTicket);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
          Support
        </h1>
        <Button size="sm" onClick={() => createMutation.mutate()} loading={createMutation.isPending}>
          New Ticket
        </Button>
      </div>

      <div className="md:flex gap-4">
        <div className="md:w-1/3 flex flex-col gap-2 mb-4 md:mb-0">
          {tickets?.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTicket(t.id)}
              className="w-full text-left p-3 transition-colors"
              style={{
                borderRadius: 'var(--radius-md)',
                background: activeTicket === t.id ? 'var(--brand-50)' : 'var(--surface-card)',
                border: activeTicket === t.id ? '1px solid var(--brand-200)' : '1px solid var(--border-default)',
              }}
            >
              <p style={{ fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                #{t.id.slice(0, 8)}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                {STATUS_LABELS[t.status] || t.status} - {new Date(t.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
          {!tickets?.length && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>No tickets yet.</p>
          )}
        </div>

        {active && (
          <div
            className="md:flex-1 flex flex-col"
            style={{
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              minHeight: 400,
            }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Status: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{STATUS_LABELS[active.status] || active.status}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[75%] px-3 py-2"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      background: m.sender_id === user?.id ? 'var(--brand-600)' : 'var(--surface-sunken)',
                      color: m.sender_id === user?.id ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {m.message}
                    <p
                      className="mt-1"
                      style={{
                        fontSize: 'var(--text-2xs)',
                        color: m.sender_id === user?.id ? 'rgba(255,255,255,0.6)' : 'var(--text-tertiary)',
                      }}
                    >
                      {new Date(m.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 outline-none"
                style={{
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  background: 'var(--surface-card)',
                  color: 'var(--text-primary)',
                }}
                onKeyDown={(e) => e.key === 'Enter' && message.trim() && sendMutation.mutate()}
              />
              <Button size="sm" onClick={() => sendMutation.mutate()} disabled={!message.trim()} loading={sendMutation.isPending}>
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
