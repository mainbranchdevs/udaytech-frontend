import { useQuery } from '@tanstack/react-query';
import { adminGetOrders } from '../../api/endpoints';
import Spinner from '../../components/ui/Spinner';

export default function DashboardPage() {
  const { data: orders, isLoading, isError } = useQuery({ queryKey: ['admin', 'orders'], queryFn: () => adminGetOrders().then(r => r.data) });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">Failed to load dashboard data.</div>;

  const today = new Date().toDateString();
  const todayOrders = orders?.filter(o => new Date(o.created_at).toDateString() === today) ?? [];
  const pending = orders?.filter(o => o.status === 'pending') ?? [];
  const totalRevenue = orders?.reduce((sum, o) => sum + o.total_price, 0) ?? 0;

  const stats = [
    { label: 'Orders Today', value: todayOrders.length, color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Orders', value: pending.length, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Total Orders', value: orders?.length ?? 0, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'bg-green-50 text-green-700' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-sm font-medium opacity-80">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders?.length ? orders.slice(0, 10).map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{o.total_price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
