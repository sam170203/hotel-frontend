import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-700/80 text-zinc-200 border border-zinc-600',
      primary: 'bg-blue-900/80 text-blue-200 border border-blue-700',
      secondary: 'bg-purple-900/80 text-purple-200 border border-purple-700',
      success: 'bg-emerald-900/80 text-emerald-200 border border-emerald-700',
      warning: 'bg-amber-900/80 text-amber-200 border border-amber-700',
      danger: 'bg-red-900/80 text-red-200 border border-red-700',
      info: 'bg-cyan-900/80 text-cyan-200 border border-cyan-700',
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
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
