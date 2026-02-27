import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTickets, createTicket, sendMessage } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const SUPPORT_STATUS_LABELS = {
  pending: 'Pending',
  not_resolved: 'Not Resolved',
  completed: 'Completed',
  open: 'Pending',
} as const;

export default function SupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { data: tickets, isLoading } = useQuery({ queryKey: ['tickets'], queryFn: () => getTickets().then(r => r.data) });

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

  const active = tickets?.find(t => t.id === activeTicket);

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Support</h1>
        <Button size="sm" onClick={() => createMutation.mutate()} loading={createMutation.isPending}>New Ticket</Button>
      </div>

      <div className="md:flex gap-4">
        <div className="md:w-1/3 space-y-2 mb-4 md:mb-0">
          {tickets?.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTicket(t.id)}
              className={`w-full text-left p-3 rounded-lg text-sm ${activeTicket === t.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-white border border-gray-200'}`}
            >
              <p className="font-medium">#{t.id.slice(0, 8)}</p>
              <p className="text-xs text-gray-500">
                {SUPPORT_STATUS_LABELS[t.status]} - {new Date(t.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
          {!tickets?.length && <p className="text-sm text-gray-500">No tickets yet.</p>}
        </div>

        {active && (
          <div className="md:flex-1 bg-white rounded-xl shadow-sm flex flex-col" style={{ minHeight: 400 }}>
            <div className="px-4 py-3 border-b text-sm text-gray-600">
              Issue status: <span className="font-medium text-gray-900">{SUPPORT_STATUS_LABELS[active.status]}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {active.messages.map(m => (
                <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.sender_id === user?.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    {m.message}
                    <p className={`text-xs mt-1 ${m.sender_id === user?.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(m.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                onKeyDown={e => e.key === 'Enter' && message.trim() && sendMutation.mutate()}
              />
              <Button size="sm" onClick={() => sendMutation.mutate()} disabled={!message.trim()} loading={sendMutation.isPending}>Send</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
