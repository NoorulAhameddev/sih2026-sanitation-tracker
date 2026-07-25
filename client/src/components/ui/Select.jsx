import React from 'react';
import { cn } from '../../utils/cn';

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-danger focus:ring-danger",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});
Select.displayName = "Select";

export default Select;
