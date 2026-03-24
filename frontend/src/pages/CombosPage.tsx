import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCombos } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function CombosPage() {
  const { data: combos, isLoading } = useQuery({
    queryKey: ['combos'],
    queryFn: () => getCombos().then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="px-4 py-4">
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Combo Packages
      </h1>
      {combos?.length ? (
        <div className="grid md:grid-cols-2 gap-3">
          {combos.map((c) => (
            <Link
              key={c.id}
              to={`/combos/${c.id}`}
              className="overflow-hidden transition-all"
              style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
            >
              {c.banner_image ? (
                <img src={c.banner_image} alt={c.name} className="w-full h-40 object-cover" />
              ) : (
                <div
                  className="w-full h-40 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-500))' }}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'white' }}>
                    {c.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="p-4">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {c.name}
                </h3>
                {c.description && (
                  <p className="line-clamp-2 mt-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {c.description}
                  </p>
                )}
                <span className="inline-block mt-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--brand-600)' }}>
                  ₹{c.price.toLocaleString('en-IN')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>No combos available yet.</p>
      )}
    </div>
  );
}
