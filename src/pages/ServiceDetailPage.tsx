import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { WrenchScrewdriverIcon, ClockIcon } from '@heroicons/react/24/outline';
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
    queryFn: () => getService(id!).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!service) return <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>Service not found</div>;

  return (
    <div className="px-4 py-6 pb-28">
      {service.image_url && (
        <div className="overflow-hidden mb-4" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)' }}>
          <img src={service.image_url} alt={service.name} className="w-full h-48 object-cover" />
        </div>
      )}

      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
        {service.name}
      </h1>
      <p className="mt-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'var(--brand-600)' }}>
        ₹{service.base_price.toLocaleString('en-IN')}
      </p>

      <div className="flex items-center gap-3 mt-3">
        <span className="flex items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          <ClockIcon className="h-4 w-4" /> ~60 min
        </span>
        <span
          className="flex items-center gap-1 px-2 py-1"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--brand-700)',
            background: 'var(--brand-50)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <WrenchScrewdriverIcon className="h-3.5 w-3.5" /> Installation Included
        </span>
      </div>

      {service.description && (
        <p className="mt-4" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
          {service.description}
        </p>
      )}

      <div
        className="fixed bottom-16 inset-x-0 z-40 px-4 py-3"
        style={{ background: 'var(--surface-card)', boxShadow: 'var(--shadow-float)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <Button
          fullWidth
          size="lg"
          variant="accent"
          onClick={() => isAuthenticated ? navigate(`/order/new?type=service&id=${service.id}`) : navigate('/login')}
        >
          Request Service
        </Button>
      </div>
    </div>
  );
}
