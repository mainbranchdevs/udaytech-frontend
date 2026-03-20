import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
}

export default function Input({ label, error, icon, trailingIcon, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-gray-400 pointer-events-none">{icon}</span>
        )}
        <input
          id={inputId}
          className={`
            w-full border rounded-lg py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-[--brand] focus:border-transparent
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
            ${icon ? 'pl-10' : 'pl-3'}
            ${trailingIcon ? 'pr-10' : 'pr-3'}
            ${className}
          `.trim()}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute right-3 text-gray-400">{trailingIcon}</span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
