import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getCombo } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function ComboDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: combo, isLoading } = useQuery({
    queryKey: ['combo', id],
    queryFn: () => getCombo(id!).then(r => r.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!combo) return <div className="text-center py-20 text-gray-500">Combo not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {combo.banner_image && <img src={combo.banner_image} alt={combo.name} className="w-full h-48 object-cover rounded-xl" />}
      <h1 className="text-xl font-bold text-gray-900 mt-4">{combo.name}</h1>
      <span className="inline-block mt-1 text-2xl font-bold text-indigo-600">₹{combo.price.toLocaleString()}</span>
      {combo.description && <p className="mt-4 text-sm text-gray-600 leading-relaxed">{combo.description}</p>}
      {combo.items.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Includes</h3>
          <ul className="space-y-1">
            {combo.items.map(item => (
              <li key={item.id} className="text-sm text-gray-600">
                {item.quantity}x {item.item_type} (ID: {item.item_id.slice(0, 8)}...)
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6">
        <Button onClick={() => isAuthenticated ? navigate(`/order/new?type=combo&id=${combo.id}`) : navigate('/login')}>
          Order Combo
        </Button>
      </div>
    </div>
  );
}
