import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTickets, sendMessage, updateTicketStatus } from '../../api/endpoints';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import type { SupportTicket } from '../../types';

type EditableSupportStatus = Exclude<SupportTicket['status'], 'open'>;

const SUPPORT_STATUS_OPTIONS: { value: EditableSupportStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'not_resolved', label: 'Not Resolved' },
  { value: 'completed', label: 'Completed' },
];

const SUPPORT_STATUS_LABELS: Record<SupportTicket['status'], string> = {
  pending: 'Pending',
  not_resolved: 'Not Resolved',
  completed: 'Completed',
  open: 'Pending',
};

export default function AdminSupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { data: tickets, isLoading, isError } = useQuery({ queryKey: ['tickets'], queryFn: () => getTickets().then(r => r.data) });

  const sendMut = useMutation({
    mutationFn: () => sendMessage({ ticket_id: activeTicket!, message }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tickets'] }); setMessage(''); },
  });

  const statusMut = useMutation({
    mutationFn: (status: EditableSupportStatus) => updateTicketStatus(activeTicket!, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tickets'] }); },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load support tickets.</div>;

  const active = tickets?.find(t => t.id === activeTicket);
  const selectedStatus = active?.status === 'open' ? 'pending' : active?.status;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Support Tickets</h1>
      <div className="flex gap-4" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="w-80 overflow-y-auto space-y-2">
          {!tickets?.length ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-500 text-center">No tickets yet.</div>
          ) : tickets.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTicket(t.id)}
              className={`w-full text-left p-3 rounded-lg text-sm ${activeTicket === t.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-white border border-gray-200'}`}
            >
              <p className="font-medium">#{t.id.slice(0, 8)}</p>
              <p className="text-xs text-gray-500">{SUPPORT_STATUS_LABELS[t.status]} - {t.messages.length} messages</p>
            </button>
          ))}
        </div>
        {active ? (
          <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b flex items-center gap-2">
              <span className="text-sm text-gray-600">Issue status:</span>
              <select
                value={selectedStatus}
                onChange={e => statusMut.mutate(e.target.value as EditableSupportStatus)}
                disabled={statusMut.isPending}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
              >
                {SUPPORT_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {active.messages.map(m => (
                <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.sender_id === user?.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    {m.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                onKeyDown={e => e.key === 'Enter' && message.trim() && sendMut.mutate()}
              />
              <Button size="sm" onClick={() => sendMut.mutate()} disabled={!message.trim()} loading={sendMut.isPending}>Send</Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a ticket to view</div>
        )}
      </div>
    </div>
  );
}
