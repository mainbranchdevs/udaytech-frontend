type BadgeVariant =
  | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  | 'admin' | 'user' | 'success' | 'danger' | 'info' | 'warning';

const styles: Record<BadgeVariant, { bg: string; color: string }> = {
  pending:    { bg: 'var(--accent-100)',  color: 'var(--accent-700)' },
  confirmed:  { bg: 'var(--brand-100)',   color: 'var(--brand-700)' },
  processing: { bg: 'var(--info-light)',  color: 'var(--info)' },
  shipped:    { bg: 'var(--brand-200)',   color: 'var(--brand-800)' },
  delivered:  { bg: 'var(--success-light)', color: 'var(--success)' },
  cancelled:  { bg: 'var(--danger-light)',  color: 'var(--danger)' },
  admin:      { bg: 'var(--brand-950)',   color: 'var(--admin-accent)' },
  user:       { bg: 'var(--surface-sunken)', color: 'var(--text-secondary)' },
  success:    { bg: 'var(--success-light)', color: 'var(--success)' },
  danger:     { bg: 'var(--danger-light)',  color: 'var(--danger)' },
  info:       { bg: 'var(--info-light)',  color: 'var(--info)' },
  warning:    { bg: 'var(--warning-light)', color: 'var(--warning)' },
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'info', children, className = '' }: BadgeProps) {
  const { bg, color } = styles[variant];
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-[10px] font-bold tracking-[0.02em] capitalize ${className}`}
      style={{
        backgroundColor: bg,
        color: color,
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {children}
    </span>
  );
}

export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    pending: 'pending',
    confirmed: 'confirmed',
    processing: 'processing',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
    open: 'warning',
    closed: 'success',
    resolved: 'success',
    admin: 'admin',
    user: 'user',
  };
  return map[status.toLowerCase()] ?? 'info';
}
