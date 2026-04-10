import { cn, formatCurrency } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  color?: 'green' | 'red' | 'blue' | 'yellow';
  prefix?: string;
}

const colorMap = {
  green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className={cn('text-2xl font-bold', value < 0 ? 'text-destructive' : 'text-foreground')}>
          {formatCurrency(value)}
        </p>
        {trend !== undefined && (
          <p className={cn('text-xs font-medium', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% vs mês anterior
          </p>
        )}
      </div>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colorMap[color])}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
