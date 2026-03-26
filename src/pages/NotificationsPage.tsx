import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then((r) => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="px-4 py-4">
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Notifications
      </h1>
      {notifications?.length ? (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className="p-4 cursor-pointer transition-colors"
              style={{
                background: n.is_read ? 'var(--surface-card)' : 'var(--brand-50)',
                border: n.is_read ? '1px solid var(--border-subtle)' : '1px solid var(--brand-200)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{n.title}</p>
                  <p className="mt-0.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{n.message}</p>
                </div>
                {!n.is_read && (
                  <span
                    className="h-2 w-2 rounded-full shrink-0 mt-2"
                    style={{ background: 'var(--accent-500)' }}
                  />
                )}
              </div>
              <p className="mt-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>No notifications.</p>
      )}
    </div>
  );
}
