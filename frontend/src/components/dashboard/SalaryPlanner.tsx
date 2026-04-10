import { Lightbulb, Target, ShoppingBag, Heart, TrendingUp, Lock } from 'lucide-react';
import { ResumoFinanceiro } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  resumo: ResumoFinanceiro;
  categorias: { categoria: string; total: number }[];
}

const NECESSIDADES = ['Moradia', 'Alimentação', 'Transporte', 'Saúde'];
const DESEJOS = ['Lazer', 'Assinaturas', 'Outros'];
const INVESTIMENTOS_CAT = ['Investimentos'];

function ProgressBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const over = max > 0 && value > max;
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-500', over ? 'bg-red-500' : colorClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SalaryPlanner({ resumo, categorias }: Props) {
  const receita = resumo.total_receitas;
  if (receita <= 0) return null;

  const ideal_necessidades = receita * 0.5;
  const ideal_desejos = receita * 0.3;
  const ideal_investimentos = receita * 0.2;

  const real_necessidades = categorias
    .filter(c => NECESSIDADES.includes(c.categoria))
    .reduce((s, c) => s + c.total, 0);
  const real_desejos = categorias
    .filter(c => DESEJOS.includes(c.categoria))
    .reduce((s, c) => s + c.total, 0);
  const real_investimentos = categorias
    .filter(c => INVESTIMENTOS_CAT.includes(c.categoria))
    .reduce((s, c) => s + c.total, 0);

  const falta_investir = Math.max(ideal_investimentos - real_investimentos, 0);

  const buckets = [
    {
      label: 'Necessidades',
      sublabel: 'Moradia · Alimentação · Transporte · Saúde',
      icon: Heart,
      real: real_necessidades,
      ideal: ideal_necessidades,
      pct: 50,
      colorClass: 'bg-blue-500',
    },
    {
      label: 'Desejos',
      sublabel: 'Lazer · Assinaturas · Outros',
      icon: ShoppingBag,
      real: real_desejos,
      ideal: ideal_desejos,
      pct: 30,
      colorClass: 'bg-purple-500',
    },
    {
      label: 'Investimentos / Poupança',
      sublabel: 'CDB · Tesouro · Ações · Cripto',
      icon: TrendingUp,
      real: real_investimentos,
      ideal: ideal_investimentos,
      pct: 20,
      colorClass: 'bg-green-500',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        <div>
          <h2 className="font-semibold">Planejamento do Salário</h2>
          <p className="text-xs text-muted-foreground">Regra 50/30/20 aplicada ao seu mês</p>
        </div>
      </div>

      <div className="space-y-5">
        {buckets.map(b => {
          const over = b.real > b.ideal;
          const diff = Math.abs(b.real - b.ideal);
          const pctUsed = b.ideal > 0 ? Math.round((b.real / b.ideal) * 100) : 0;
          return (
            <div key={b.label} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <b.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {b.label}{' '}
                      <span className="text-muted-foreground font-normal">({b.pct}%)</span>
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{b.sublabel}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn('text-sm font-semibold', over ? 'text-red-600' : 'text-foreground')}>
                    {formatCurrency(b.real)}
                  </p>
                  <p className="text-xs text-muted-foreground">limite {formatCurrency(b.ideal)}</p>
                </div>
              </div>
              <ProgressBar value={b.real} max={b.ideal} colorClass={b.colorClass} />
              <p className={cn('text-xs', over ? 'text-red-600' : 'text-green-600')}>
                {over
                  ? `⚠ Acima do ideal em ${formatCurrency(diff)} (${pctUsed}% usado)`
                  : `✓ ${pctUsed}% usado — ${formatCurrency(diff)} disponível`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Despesas Fixas do mês */}
      <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Resumo do mês</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Receita total</span>
            <span className="font-medium text-green-600">{formatCurrency(receita)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total gasto</span>
            <span className="font-medium text-red-600">{formatCurrency(resumo.total_despesas)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saldo livre</span>
            <span className={cn('font-semibold', resumo.saldo >= 0 ? 'text-green-600' : 'text-red-600')}>
              {formatCurrency(resumo.saldo)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">% do salário gasto</span>
            <span className="font-medium">
              {receita > 0 ? Math.round((resumo.total_despesas / receita) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Recomendação */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <p className="text-sm font-semibold">O que fazer com o que sobrou</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Seu saldo este mês é{' '}
          <span className={cn('font-semibold', resumo.saldo >= 0 ? 'text-green-600' : 'text-red-600')}>
            {formatCurrency(resumo.saldo)}
          </span>.
          {falta_investir > 0
            ? ` Para fechar a regra 50/30/20, invista ainda `
            : ` Você já atingiu a meta de investimentos do mês. `}
          {falta_investir > 0 && (
            <span className="font-semibold text-foreground">{formatCurrency(falta_investir)}</span>
          )}
          {falta_investir > 0 && ` este mês.`}
        </p>
        {resumo.sugestoes_investimento.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {resumo.sugestoes_investimento.slice(0, 3).map((s, i) => (
              <div key={i} className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 flex gap-1.5">
                <span className="font-medium">{s.tipo}</span>
                <span className="text-muted-foreground">·</span>
                <span>{formatCurrency(s.valor_mensal)}/mês</span>
                <span className="text-muted-foreground">({s.percentual}%)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
