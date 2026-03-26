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
    queryFn: () => getCombo(id!).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!combo) return <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>Combo not found</div>;

  return (
    <div className="px-4 py-6 pb-28">
      {combo.banner_image && (
        <div className="overflow-hidden mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
          <img src={combo.banner_image} alt={combo.name} className="w-full h-48 object-cover" />
        </div>
      )}

      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
        {combo.name}
      </h1>
      <p className="mt-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'var(--brand-600)' }}>
        ₹{combo.price.toLocaleString('en-IN')}
      </p>

      {combo.description && (
        <p className="mt-4" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
          {combo.description}
        </p>
      )}

      {combo.items.length > 0 && (
        <div className="mt-4">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Includes
          </h3>
          <div className="flex flex-col gap-2">
            {combo.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2"
                style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)' }}
              >
                <span
                  className="px-2 py-0.5 capitalize"
                  style={{
                    fontSize: 'var(--text-2xs)',
                    fontWeight: 700,
                    color: item.item_type === 'service' ? 'var(--brand-700)' : 'var(--accent-600)',
                    background: item.item_type === 'service' ? 'var(--brand-100)' : 'var(--accent-100)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {item.item_type}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  {item.quantity}x (ID: {item.item_id.slice(0, 8)}...)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="fixed bottom-16 inset-x-0 z-40 px-4 py-3"
        style={{ background: 'var(--surface-card)', boxShadow: 'var(--shadow-float)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <Button
          fullWidth
          size="lg"
          variant="accent"
          onClick={() => isAuthenticated ? navigate(`/order/new?type=combo&id=${combo.id}`) : navigate('/login')}
        >
          Order Combo
        </Button>
      </div>
    </div>
  );
}
