import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'orange' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:   'bg-[--brand-600] text-white hover:bg-[--brand-700] hover:-translate-y-px active:translate-y-px transition-all',
  accent:    'bg-[--accent-500] text-white hover:bg-[--accent-600] active:translate-y-px transition-all',
  secondary: 'bg-transparent text-[--brand-600] hover:bg-[--brand-50] active:translate-y-px transition-all',
  ghost:     'bg-transparent text-[--text-secondary] hover:bg-[--surface-sunken] active:translate-y-px transition-colors',
  danger:    'bg-[--danger] text-white hover:brightness-90 active:translate-y-px transition-all',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-4 text-[length:var(--text-xs)]',
  md: 'h-10 px-5 text-[length:var(--text-sm)]',
  lg: 'h-12 px-6 text-[length:var(--text-base)]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const resolved = variant === 'orange' ? 'accent' : variant;
  const shadow = resolved === 'primary' || resolved === 'accent'
    ? { boxShadow: 'var(--shadow-accent)' }
    : resolved === 'secondary'
      ? { border: '1.5px solid var(--brand-600)' }
      : undefined;

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold select-none
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[resolved]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      style={{
        fontFamily: 'var(--font-heading)',
        borderRadius: 'var(--radius-md)',
        ...shadow,
      }}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" variant={resolved === 'accent' ? 'accent' : 'brand'} />}
      <span className={loading ? 'opacity-60' : ''}>{children}</span>
    </button>
  );
}
