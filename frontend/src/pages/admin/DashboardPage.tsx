import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ShoppingBagIcon, ClockIcon, CurrencyRupeeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { adminGetOrders } from '../../api/endpoints';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import Badge, { statusVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminGetOrders().then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return (
    <div className="p-4" style={{ background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)' }}>
      Failed to load dashboard data.
    </div>
  );

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const todayOrders = orders?.filter((o) => new Date(o.created_at).toDateString() === today) ?? [];
  const yesterdayOrders = orders?.filter((o) => new Date(o.created_at).toDateString() === yesterday) ?? [];
  const pending = orders?.filter((o) => o.status === 'pending') ?? [];
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total_price, 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_price, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { label: "Today's Orders", value: todayOrders.length, prev: yesterdayOrders.length, icon: ShoppingBagIcon, format: (v: number) => String(v) },
    { label: 'Pending Orders', value: pending.length, prev: pending.length, icon: ClockIcon, format: (v: number) => String(v) },
    { label: 'Total Orders', value: orders?.length ?? 0, prev: (orders?.length ?? 0) - todayOrders.length, icon: ClipboardDocumentListIcon, format: (v: number) => String(v) },
    { label: "Today's Revenue", value: todayRevenue, prev: yesterdayRevenue, icon: CurrencyRupeeIcon, format: (v: number) => `₹${v.toLocaleString('en-IN')}` },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
            {greeting}, {user?.name || 'Admin'}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link to="/admin/orders">
          <Button variant="secondary" size="sm">View All Orders</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const up = s.value >= s.prev;
          const diff = s.value - s.prev;
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="p-5"
              style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>{s.label}</p>
                <div
                  className="h-9 w-9 flex items-center justify-center"
                  style={{ background: 'var(--brand-50)', borderRadius: 'var(--radius-md)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: 'var(--brand-600)' }} />
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
                {s.format(s.value)}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                {diff !== 0 ? (
                  <>
                    {up ? <ArrowTrendingUpIcon className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} /> : <ArrowTrendingDownIcon className="h-3.5 w-3.5" style={{ color: 'var(--danger)' }} />}
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: up ? 'var(--success)' : 'var(--danger)' }}>
                      {s.format(Math.abs(diff))} vs yesterday
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Same as yesterday</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { to: '/admin/products', label: '+ Add Product' },
          { to: '/admin/services', label: '+ Add Service' },
          { to: '/admin/banners', label: '+ Add Banner' },
          { to: '/admin/categories', label: '+ Add Category' },
        ].map(({ to, label }) => (
          <Link key={to} to={to}>
            <Button variant="secondary" size="sm">{label}</Button>
          </Link>
        ))}
      </div>

      {/* Recent Orders table */}
      <div
        className="overflow-hidden"
        style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
            Recent Orders
          </h2>
          <Link to="/admin/orders" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--brand-600)' }}>
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full" style={{ fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                {['Order ID', 'Status', 'Amount', 'Date'].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 ${['Amount', 'Date'].includes(h) ? 'text-right' : 'text-left'}`}
                    style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.length ? orders.slice(0, 10).map((o) => (
                <tr
                  key={o.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-50)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td className="px-5 py-3.5 font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    #{o.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3.5"><Badge variant={statusVariant(o.status)}>{o.status}</Badge></td>
                  <td className="px-5 py-3.5 text-right" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    ₹{o.total_price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 text-right" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {new Date(o.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-5 py-8 text-center" colSpan={4} style={{ color: 'var(--text-tertiary)' }}>
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
