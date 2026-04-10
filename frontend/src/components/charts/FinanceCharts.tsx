import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { EvolucaoMensal, SimulacaoPonto } from '@/types';

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const currencyFormatter = (v: number) => formatCurrency(v);

export function EvolucaoChart({ data }: { data: EvolucaoMensal[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradReceitas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradDespesas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={currencyFormatter} />
        <Legend />
        <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#22c55e" fill="url(#gradReceitas)" strokeWidth={2} />
        <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#ef4444" fill="url(#gradDespesas)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SaldoChart({ data }: { data: EvolucaoMensal[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={currencyFormatter} />
        <Bar dataKey="saldo" name="Saldo" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.saldo >= 0 ? '#22c55e' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryChart({ data }: { data: { categoria: string; total: number }[] }) {
  const total = data.reduce((s, d) => s + d.total, 0);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="total" nameKey="categoria" label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v: number) => [formatCurrency(v), `${((v/total)*100).toFixed(1)}%`]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SimulacaoChart({ data }: { data: SimulacaoPonto[] }) {
  const sampled = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 24)) === 0 || i === data.length - 1);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={sampled} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradValor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradAporte" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="mes" tickFormatter={v => `${v}m`} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={currencyFormatter} />
        <Legend />
        <Area type="monotone" dataKey="valor" name="Total acumulado" stroke="#3b82f6" fill="url(#gradValor)" strokeWidth={2} />
        <Area type="monotone" dataKey="aporte_total" name="Total investido" stroke="#f59e0b" fill="url(#gradAporte)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SparklineChart({ prices }: { prices: number[] }) {
  const sampled = prices.filter((_, i) => i % 4 === 0);
  const data = sampled.map((p, i) => ({ i, v: p }));
  const isPositive = sampled[sampled.length - 1] >= sampled[0];
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data}>
        <Area type="monotone" dataKey="v" stroke={isPositive ? '#22c55e' : '#ef4444'} fill={isPositive ? '#22c55e20' : '#ef444420'} strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
