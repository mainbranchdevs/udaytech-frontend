import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getOrder } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import Badge, { statusVariant } from '../components/ui/Badge';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function StepTracker({ status }: { status: string }) {
  const activeIdx = STATUS_STEPS.indexOf(status.toLowerCase());
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl">
        <XCircleIcon className="h-5 w-5 text-red-500" />
        <span className="text-sm font-semibold text-red-700">Order Cancelled</span>
      </div>
    );
  }
  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        {STATUS_STEPS.map((step, i) => {
          const done = i <= activeIdx;
          const active = i === activeIdx;
          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              {/* Line */}
              {i < STATUS_STEPS.length - 1 && (
                <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${i < activeIdx ? 'bg-[--brand]' : 'bg-gray-200'}`} />
              )}
              {/* Dot */}
              <div className={`h-7 w-7 rounded-full z-10 flex items-center justify-center border-2 transition-colors ${
                done ? 'bg-[--brand] border-[--brand]' : 'bg-white border-gray-300'
              } ${active ? 'ring-4 ring-blue-100' : ''}`}>
                {done && <CheckCircleIcon className="h-4 w-4 text-white" />}
              </div>
              <p className={`text-[10px] mt-1.5 text-center capitalize ${done ? 'text-[--brand] font-semibold' : 'text-gray-400'}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id!).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(order.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
        </div>
      </div>

      {/* Step tracker */}
      <div className="bg-white mt-2 px-4 py-5">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <TruckIcon className="h-4 w-4" /> Order Status
        </h2>
        <StepTracker status={order.status} />
      </div>

      {/* Order summary */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Summary</h2>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-bold text-gray-900">₹{order.total_price.toLocaleString('en-IN')}</span>
          </div>
          {order.notes && (
            <div className="pt-2 mt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-semibold mb-1">Notes</p>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Items</h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{item.item_type}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-gray-900">₹{item.price_snapshot.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {order.status_history.length > 0 && (
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" /> Timeline
          </h2>
          <ol className="relative border-l border-gray-200 ml-2">
            {order.status_history.map((h) => (
              <li key={h.id} className="mb-4 ml-5">
                <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-[--brand] border-2 border-white" />
                <p className="text-sm font-semibold capitalize text-gray-800">{h.status}</p>
                <p className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                {h.notes && <p className="text-xs text-gray-400 mt-0.5">{h.notes}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
