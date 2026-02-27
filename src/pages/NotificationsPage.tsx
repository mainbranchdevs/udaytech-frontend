import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: () => getNotifications().then(r => r.data) });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">Notifications</h1>
      {notifications?.length ? (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className={`p-4 rounded-xl shadow-sm cursor-pointer ${n.is_read ? 'bg-white' : 'bg-indigo-50 border border-indigo-100'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                </div>
                {!n.is_read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-2" />}
              </div>
              <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No notifications.</p>
      )}
    </div>
  );
}
