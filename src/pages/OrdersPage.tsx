import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => getOrders().then(r => r.data) });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">My Orders</h1>
      {orders?.length ? (
        <div className="space-y-3">
          {orders.map(o => (
            <Link key={o.id} to={`/orders/${o.id}`} className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                  <p className="text-sm font-bold text-gray-900 mt-1">₹{o.total_price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
      )}
    </div>
  );
}
