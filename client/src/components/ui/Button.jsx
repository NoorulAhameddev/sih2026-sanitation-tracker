import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover border border-transparent shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-transparent',
    danger: 'bg-danger text-danger-foreground hover:bg-danger-hover border border-transparent shadow-sm',
    ghost: 'bg-transparent text-foreground hover:bg-muted border border-transparent',
    outline: 'bg-transparent text-foreground border border-border hover:bg-muted shadow-sm',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-lg',
    icon: 'h-10 w-10 flex items-center justify-center p-0',
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
