import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCombos } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function CombosPage() {
  const { data: combos, isLoading } = useQuery({ queryKey: ['combos'], queryFn: () => getCombos().then(r => r.data) });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="px-4 py-4 max-w-4xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">Combo Packages</h1>
      {combos?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {combos.map(c => (
            <Link key={c.id} to={`/combos/${c.id}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {c.banner_image && <img src={c.banner_image} alt={c.name} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{c.name}</h3>
                {c.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>}
                <span className="inline-block mt-2 text-lg font-bold text-indigo-600">₹{c.price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No combos available yet.</p>
      )}
    </div>
  );
}
