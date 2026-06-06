import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-mc-income/10 text-mc-income border border-mc-income/20',
  error: 'bg-mc-expense/10 text-mc-expense border border-mc-expense/20',
  warning: 'bg-mc-warning/10 text-mc-warning border border-mc-warning/20',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  neutral: 'bg-mc-bg-subtle text-mc-text-2 border border-mc-border',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
