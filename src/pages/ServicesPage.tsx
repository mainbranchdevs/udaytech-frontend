import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getServices } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function ServicesPage() {
  const { data: services, isLoading } = useQuery({ queryKey: ['services'], queryFn: () => getServices().then(r => r.data) });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="px-4 py-4 max-w-4xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">Our Services</h1>
      {services?.length ? (
        <div className="grid gap-3">
          {services.map(s => (
            <Link key={s.id} to={`/services/${s.id}`} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{s.name}</h3>
                  {s.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>}
                </div>
                <span className="text-sm font-bold text-indigo-600 shrink-0 ml-4">₹{s.base_price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No services available yet.</p>
      )}
    </div>
  );
}
