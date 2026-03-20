import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTickets, sendMessage, updateTicketStatus } from '../../api/endpoints';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge, { statusVariant } from '../../components/ui/Badge';
import type { SupportTicket } from '../../types';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

type EditableSupportStatus = Exclude<SupportTicket['status'], 'open'>;
const SUPPORT_STATUS_OPTIONS: { value: EditableSupportStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'not_resolved', label: 'Not Resolved' },
  { value: 'completed', label: 'Completed' },
];
const STATUS_LABEL: Record<SupportTicket['status'], string> = { pending: 'Pending', not_resolved: 'Not Resolved', completed: 'Completed', open: 'Open' };

export default function AdminSupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { data: tickets, isLoading, isError } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTickets().then((r) => r.data),
  });

  const sendMut = useMutation({
    mutationFn: () => sendMessage({ ticket_id: activeTicket!, message }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tickets'] }); setMessage(''); },
  });

  const statusMut = useMutation({
    mutationFn: (status: EditableSupportStatus) => updateTicketStatus(activeTicket!, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load support tickets.</div>;

  const active = tickets?.find((t) => t.id === activeTicket);
  const selectedStatus = active?.status === 'open' ? 'pending' : active?.status;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Support Tickets</h1>
      <div className="flex gap-4" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Ticket list */}
        <div className="w-72 shrink-0 overflow-y-auto space-y-1.5 pr-1">
          {!tickets?.length ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <ChatBubbleLeftRightIcon className="h-10 w-10 mx-auto text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">No tickets yet.</p>
            </div>
          ) : tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTicket(t.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm ${
                activeTicket === t.id
                  ? 'bg-blue-50 border-[--brand]'
                  : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-xs text-gray-600 font-mono">#{t.id.slice(0, 8).toUpperCase()}</p>
                <Badge variant={statusVariant(t.status)}>{STATUS_LABEL[t.status]}</Badge>
              </div>
              <p className="text-xs text-gray-400">{t.messages.length} message{t.messages.length !== 1 ? 's' : ''}</p>
            </button>
          ))}
        </div>

        {/* Chat panel */}
        {active ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col min-h-0">
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
              <div>
                <p className="text-sm font-bold text-gray-900">Ticket #{active.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => statusMut.mutate(e.target.value as EditableSupportStatus)}
                  disabled={statusMut.isPending}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[--brand]"
                >
                  {SUPPORT_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    m.sender_id === user?.id
                      ? 'rounded-tr-sm text-white'
                      : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                  }`} style={m.sender_id === user?.id ? { background: 'var(--brand)' } : {}}>
                    {m.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--brand]"
                onKeyDown={(e) => e.key === 'Enter' && message.trim() && sendMut.mutate()}
              />
              <Button size="sm" onClick={() => sendMut.mutate()} disabled={!message.trim()} loading={sendMut.isPending}>
                <PaperAirplaneIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-100">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-200 mb-3" />
              <p className="text-sm">Select a ticket to view the conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
