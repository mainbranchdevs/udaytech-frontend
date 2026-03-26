import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClockIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { getServices } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function ServicesPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices().then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="px-4 py-4">
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Our Services
      </h1>
      {services?.length ? (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <Link
              key={s.id}
              to={`/services/${s.id}`}
              className="p-4 transition-all"
              style={{
                background: 'var(--surface-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="line-clamp-2 mt-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {s.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1" style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>
                      <ClockIcon className="h-3 w-3" /> ~60 min
                    </span>
                    <span
                      className="flex items-center gap-1 px-1.5 py-0.5"
                      style={{
                        fontSize: 'var(--text-2xs)',
                        fontWeight: 600,
                        color: 'var(--brand-700)',
                        background: 'var(--brand-50)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <WrenchScrewdriverIcon className="h-3 w-3" /> Installation Included
                    </span>
                  </div>
                </div>
                <span className="shrink-0 ml-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--brand-600)' }}>
                  ₹{s.base_price.toLocaleString('en-IN')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>No services available yet.</p>
      )}
    </div>
  );
}
