import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getOrder } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id!).then(r => r.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h1>
      <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>

      <div className="mt-4 bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span className="text-sm font-medium capitalize">{order.status}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-sm font-bold">₹{order.total_price.toLocaleString()}</span>
        </div>
        {order.notes && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500">Notes</p>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Items</h3>
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {order.items.map(item => (
            <div key={item.id} className="p-3 flex justify-between">
              <div>
                <p className="text-sm text-gray-900 capitalize">{item.item_type}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">₹{item.price_snapshot.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {order.status_history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Timeline</h3>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <ol className="relative border-l border-gray-200 ml-3">
              {order.status_history.map(h => (
                <li key={h.id} className="mb-4 ml-4">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-indigo-500" />
                  <p className="text-sm font-medium capitalize">{h.status}</p>
                  <p className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString()}</p>
                  {h.notes && <p className="text-xs text-gray-400 mt-0.5">{h.notes}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
