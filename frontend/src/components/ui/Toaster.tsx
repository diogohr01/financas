import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToasterProps {
  toasts: Toast[];
  dismiss: (id: string) => void;
}

export function Toaster({ toasts, dismiss }: ToasterProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-card animate-in slide-in-from-right',
            toast.variant === 'destructive' ? 'border-destructive/50' : 'border-border'
          )}
        >
          {toast.variant === 'destructive'
            ? <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            : <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          }
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.description && <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
