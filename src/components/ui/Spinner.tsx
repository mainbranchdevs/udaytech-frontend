interface SpinnerProps {
  className?: string;
  variant?: 'brand' | 'accent';
}

export default function Spinner({ className = 'h-6 w-6', variant = 'brand' }: SpinnerProps) {
  const color = variant === 'accent' ? 'text-[--accent-500]' : 'text-[--brand-500]';
  const track = variant === 'accent' ? 'text-[--accent-100]' : 'text-[--brand-100]';

  return (
    <svg
      className={`animate-spin ${color} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className={track}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={variant === 'accent' ? 'var(--accent-500)' : 'var(--brand-500)'}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
