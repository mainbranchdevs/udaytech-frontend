type BadgeVariant = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'admin' | 'user' | 'success' | 'danger' | 'info' | 'warning';

const styles: Record<BadgeVariant, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  admin:      'bg-orange-100 text-orange-800',
  user:       'bg-gray-100 text-gray-700',
  success:    'bg-green-100 text-green-800',
  danger:     'bg-red-100 text-red-800',
  info:       'bg-blue-100 text-blue-800',
  warning:    'bg-yellow-100 text-yellow-800',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'info', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

/** Map order/support status strings to badge variants */
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
