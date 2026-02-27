import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getService } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getService(id!).then(r => r.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!service) return <div className="text-center py-20 text-gray-500">Service not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">{service.name}</h1>
      <span className="inline-block mt-2 text-2xl font-bold text-indigo-600">₹{service.base_price.toLocaleString()}</span>
      {service.description && <p className="mt-4 text-sm text-gray-600 leading-relaxed">{service.description}</p>}
      <div className="mt-6">
        <Button onClick={() => isAuthenticated ? navigate(`/order/new?type=service&id=${service.id}`) : navigate('/login')}>
          Request Service
        </Button>
      </div>
    </div>
  );
}
