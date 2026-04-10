import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { dashboardService, despesaService, receitaService } from '@/services/financeService';
import { EvolucaoMensal } from '@/types';
import { EvolucaoChart, CategoryChart } from '@/components/charts/FinanceCharts';
import { Select } from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils';

const MONTHS = [
  { value: '', label: 'Ano completo' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2024, i).toLocaleString('pt-BR', { month: 'long' }),
  })),
];

const YEARS = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: String(y), label: String(y) };
});

export default function Reports() {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState('');
  const [evolucao, setEvolucao] = useState<EvolucaoMensal[]>([]);
  const [categorias, setCategorias] = useState<{ categoria: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.getEvolucao(Number(year)),
      despesaService.getByCategory(Number(year), month ? Number(month) : undefined),
    ]).then(([e, c]) => {
      setEvolucao(e);
      setCategorias(c);
    }).finally(() => setLoading(false));
  }, [year, month]);

  const totalReceitas = evolucao.reduce((s, e) => s + (month ? (e.mes === Number(month) ? e.receitas : 0) : e.receitas), 0);
  const totalDespesas = evolucao.reduce((s, e) => s + (month ? (e.mes === Number(month) ? e.despesas : 0) : e.despesas), 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select options={YEARS} value={year} onChange={e => setYear(e.target.value)} className="w-32" />
        <Select options={MONTHS} value={month} onChange={e => setMonth(e.target.value)} className="w-40" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Receitas', value: totalReceitas, color: 'text-green-600' },
          { label: 'Total Despesas', value: totalDespesas, color: 'text-red-600' },
          { label: 'Saldo', value: saldo, color: saldo >= 0 ? 'text-blue-600' : 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{formatCurrency(value)}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Evolução {year}
            </h2>
            <EvolucaoChart data={evolucao} />
          </div>

          {categorias.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-4">Despesas por Categoria</h2>
              <CategoryChart data={categorias} />
              <div className="mt-4 space-y-2">
                {categorias.sort((a, b) => b.total - a.total).map(c => (
                  <div key={c.categoria} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{c.categoria}</span>
                    <span className="font-medium">{formatCurrency(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
