import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  animated?: boolean;
}

const variantStyles: Record<ProgressVariant, string> = {
  default: 'bg-mc-accent',
  success: 'bg-mc-income',
  warning: 'bg-mc-warning',
  error: 'bg-mc-expense',
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = 'default',
      showLabel = false,
      animated = true,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-mc-text-2">Progress</span>
            <span className="font-medium text-mc-text-1 tabular-nums">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div className="h-2 w-full overflow-hidden rounded-full bg-mc-bg-subtle">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              animated && 'ease-out',
              variantStyles[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
