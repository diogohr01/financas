import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function getMonthName(month: number): string {
  return new Date(2024, month - 1).toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min((current / total) * 100, 100);
}
