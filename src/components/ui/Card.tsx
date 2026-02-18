import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, padding = 'md', hover = true, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl overflow-hidden transition-all duration-300',
          paddings[padding],
          hover && 'cursor-pointer hover:-translate-y-1',
          className
        )}
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardElementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = ({ className, children, ...props }: CardElementProps) => (
  <div className={cn('mb-4', className)} {...props}>{children}</div>
);

export const CardTitle = ({ className, children, ...props }: CardElementProps) => (
  <h3 className={cn('text-lg font-bold', className)} style={{ color: 'var(--text-primary)', ...props.style }} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: CardElementProps) => (
  <p className={cn('text-sm mt-1 line-clamp-2', className)} style={{ color: 'var(--text-secondary)', ...props.style }} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: CardElementProps) => (
  <div className={className} {...props}>{children}</div>
);

export const CardFooter = ({ className, children, ...props }: CardElementProps) => (
  <div className={cn('mt-4 pt-4', className)} style={{ borderTop: '1px solid var(--border-color)', ...props.style }} {...props}>
    {children}
  </div>
);