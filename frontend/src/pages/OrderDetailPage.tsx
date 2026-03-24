import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ClockIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getOrder } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import Badge, { statusVariant } from '../components/ui/Badge';
import Button from '../components/ui/Button';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function VerticalTimeline({ status }: { status: string }) {
  const activeIdx = STATUS_STEPS.indexOf(status.toLowerCase());

  if (status === 'cancelled') {
    return (
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: 'var(--danger-light)', borderRadius: 'var(--radius-lg)' }}
      >
        <XCircleIcon className="h-5 w-5" style={{ color: 'var(--danger)' }} />
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--danger)' }}>Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="relative ml-3">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= activeIdx;
        const isLast = i === STATUS_STEPS.length - 1;
        return (
          <div key={step} className="flex gap-3 pb-5 relative">
            {!isLast && (
              <div
                className="absolute left-[7px] top-5 w-0.5 h-full"
                style={{ background: done ? 'var(--brand-500)' : 'var(--border-default)' }}
              />
            )}
            <div
              className="w-4 h-4 rounded-full shrink-0 mt-0.5 z-10"
              style={{
                background: done ? 'var(--brand-500)' : 'var(--surface-card)',
                border: done ? 'none' : '2px solid var(--border-default)',
                boxShadow: i === activeIdx ? '0 0 0 4px var(--brand-100)' : 'none',
              }}
            />
            <div>
              <p
                className="capitalize"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: done ? 600 : 400,
                  color: done ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                {step}
              </p>
            </div>
          </div>
        );
      })}
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
  if (!order) return <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>Order not found</div>;

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 py-4" style={{ background: 'var(--surface-card)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {new Date(order.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
        </div>
      </div>

      {/* Status tracker */}
      <div className="mt-2 px-4 py-5" style={{ background: 'var(--surface-card)' }}>
        <h2 className="flex items-center gap-1.5 mb-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <TruckIcon className="h-4 w-4" /> Order Status
        </h2>
        <VerticalTimeline status={order.status} />
      </div>

      {/* Summary */}
      <div className="mt-2 px-4 py-4" style={{ background: 'var(--surface-card)' }}>
        <h2 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
          Order Summary
        </h2>
        <div className="flex justify-between" style={{ fontSize: 'var(--text-sm)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{order.total_price.toLocaleString('en-IN')}</span>
        </div>
        {order.notes && (
          <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Notes</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{order.notes}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mt-2 px-4 py-4" style={{ background: 'var(--surface-card)' }}>
        <h2 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
          Items
        </h2>
        {order.items.map((item) => (
          <div
            key={item.id}
            className="py-3 flex justify-between items-center"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div>
              <p className="capitalize" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{item.item_type}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>Qty: {item.quantity}</p>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{item.price_snapshot.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {order.status_history.length > 0 && (
        <div className="mt-2 px-4 py-4" style={{ background: 'var(--surface-card)' }}>
          <h2 className="flex items-center gap-1.5 mb-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <ClockIcon className="h-4 w-4" /> Timeline
          </h2>
          <ol className="relative ml-2" style={{ borderLeft: '2px solid var(--border-default)' }}>
            {order.status_history.map((h) => (
              <li key={h.id} className="mb-4 ml-5 relative">
                <div
                  className="absolute -left-[23px] mt-1 h-3 w-3 rounded-full"
                  style={{ background: 'var(--brand-500)', border: '2px solid var(--surface-card)' }}
                />
                <p className="capitalize" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{h.status}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  {new Date(h.timestamp).toLocaleString('en-IN')}
                </p>
                {h.notes && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{h.notes}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Support CTA */}
      <div className="px-4 mt-4">
        <Link to="/support">
          <Button variant="ghost" fullWidth>Need Help? Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
