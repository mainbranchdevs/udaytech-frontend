import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ShoppingBagIcon, ClockIcon, CurrencyRupeeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { adminGetOrders } from '../../api/endpoints';
import Spinner from '../../components/ui/Spinner';
import Badge, { statusVariant } from '../../components/ui/Badge';

export default function DashboardPage() {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminGetOrders().then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (isError) return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load dashboard data.</div>
  );

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const todayOrders = orders?.filter((o) => new Date(o.created_at).toDateString() === today) ?? [];
  const yesterdayOrders = orders?.filter((o) => new Date(o.created_at).toDateString() === yesterday) ?? [];
  const pending = orders?.filter((o) => o.status === 'pending') ?? [];
  // totalRevenue is unused
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total_price, 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_price, 0);

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      prev: yesterdayOrders.length,
      icon: ShoppingBagIcon,
      color: '#2874f0',
      bg: 'bg-blue-50',
      format: (v: number) => String(v),
    },
    {
      label: 'Pending Orders',
      value: pending.length,
      prev: pending.length,
      icon: ClockIcon,
      color: '#ff9900',
      bg: 'bg-orange-50',
      format: (v: number) => String(v),
    },
    {
      label: 'Total Orders',
      value: orders?.length ?? 0,
      prev: (orders?.length ?? 0) - todayOrders.length,
      icon: ClipboardDocumentListIcon,
      color: '#6366f1',
      bg: 'bg-indigo-50',
      format: (v: number) => String(v),
    },
    {
      label: "Today's Revenue",
      value: todayRevenue,
      prev: yesterdayRevenue,
      icon: CurrencyRupeeIcon,
      color: '#16a34a',
      bg: 'bg-green-50',
      format: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/orders" className="px-4 py-2 text-sm font-semibold text-white rounded-lg btn-brand">
            View All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const up = s.value >= s.prev;
          const diff = s.value - s.prev;
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.format(s.value)}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {diff !== 0 && (
                  <>
                    {up ? <ArrowTrendingUpIcon className="h-3.5 w-3.5 text-green-500" /> : <ArrowTrendingDownIcon className="h-3.5 w-3.5 text-red-500" />}
                    <span className={`text-xs font-medium ${up ? 'text-green-600' : 'text-red-600'}`}>
                      {s.format(Math.abs(diff))} vs yesterday
                    </span>
                  </>
                )}
                {diff === 0 && <span className="text-xs text-gray-400">Same as yesterday</span>}
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
          <Link key={to} to={to} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-[--brand] hover:text-[--brand] transition-colors shadow-sm">
            {label}
          </Link>
        ))}
      </div>

      {/* Recent Orders table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-[--brand] font-semibold hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.length ? orders.slice(0, 10).map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3.5"><Badge variant={statusVariant(o.status)}>{o.status}</Badge></td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-900">₹{o.total_price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-5 py-8 text-center text-gray-400" colSpan={4}>No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
