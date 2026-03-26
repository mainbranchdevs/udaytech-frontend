import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  trailingIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5"
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 pointer-events-none transition-colors" style={{ color: 'var(--text-tertiary)' }}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full text-[length:var(--text-sm)] transition-all duration-150
            focus:outline-none
            ${icon ? 'pl-10' : 'pl-3'}
            ${trailingIcon ? 'pr-10' : 'pr-3'}
            ${className}
          `.trim()}
          style={{
            height: '44px',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border-default)'}`,
            background: 'var(--surface-card)',
            color: 'var(--text-primary)',
            boxShadow: error
              ? '0 0 0 2px var(--danger-light)'
              : undefined,
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'var(--border-focus)';
              e.target.style.boxShadow = '0 0 0 2px var(--brand-100), var(--shadow-sm)';
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = 'var(--border-default)';
              e.target.style.boxShadow = 'none';
            }
            props.onBlur?.(e);
          }}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute right-3" style={{ color: 'var(--text-tertiary)' }}>
            {trailingIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--danger)' }}>
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="mt-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
