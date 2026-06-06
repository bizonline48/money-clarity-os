import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export type SkeletonVariant = 'text' | 'card' | 'avatar' | 'rect';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  card: 'h-32 w-full rounded-mc-md',
  avatar: 'h-12 w-12 rounded-full',
  rect: 'rounded-mc-sm',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      count = 1,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const skeletonStyle = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    };

    if (count > 1) {
      return (
        <div ref={ref} className="space-y-2">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'animate-pulse bg-mc-bg-subtle',
                variantStyles[variant],
                className
              )}
              style={skeletonStyle}
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-mc-bg-subtle',
          variantStyles[variant],
          className
        )}
        style={skeletonStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
