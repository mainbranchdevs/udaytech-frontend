import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'orange' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles = {
  primary: 'btn-brand text-white',
  secondary: 'bg-white border-2 border-[--brand] text-[--brand] hover:bg-[--brand-light] transition-colors',
  orange: 'btn-orange text-white',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 transition-colors',
  danger: 'bg-red-500 hover:bg-red-600 text-white transition-colors',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
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
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold select-none
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
