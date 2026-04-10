import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-destructive',
          className
        )}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';
