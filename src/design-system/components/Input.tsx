import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-mc-text-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-mc-md border bg-mc-bg-surface px-3 py-2',
            'text-mc-text-1 placeholder:text-mc-text-3',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-mc-accent focus:ring-offset-1',
            error
              ? 'border-mc-error focus:ring-mc-error'
              : 'border-mc-border hover:border-mc-text-3',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-mc-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-mc-text-3">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
