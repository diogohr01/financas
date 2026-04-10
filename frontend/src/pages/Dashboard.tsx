import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, AlertTriangle, Lightbulb } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { EvolucaoChart, SaldoChart, CategoryChart } from '@/components/charts/FinanceCharts';
import { dashboardService, despesaService } from '@/services/financeService';
import { ResumoFinanceiro, EvolucaoMensal } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [evolucao, setEvolucao] = useState<EvolucaoMensal[]>([]);
  const [categorias, setCategorias] = useState<{ categoria: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      dashboardService.getResumo(),
      dashboardService.getEvolucao(year),
      despesaService.getByCategory(year),
    ]).then(([r, e, c]) => {
      setResumo(r);
      setEvolucao(e);
      setCategorias(c);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {resumo?.alertas && resumo.alertas.length > 0 && (
        <div className="space-y-2">
          {resumo.alertas.map((alerta, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm dark:bg-yellow-900/20 dark:border-yellow-900/50">
              <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-yellow-800 dark:text-yellow-400">{alerta}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Saldo Atual" value={resumo?.saldo ?? 0} icon={Wallet} color={resumo?.saldo && resumo.saldo >= 0 ? 'green' : 'red'} />
        <StatCard title="Total Recebido" value={resumo?.total_receitas ?? 0} icon={TrendingUp} color="green" />
        <StatCard title="Total Gasto" value={resumo?.total_despesas ?? 0} icon={TrendingDown} color="red" />
        <StatCard title="Economia Mensal" value={resumo?.economia_mensal ?? 0} icon={PiggyBank} color="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Evolução Anual {year}</h2>
          <EvolucaoChart data={evolucao} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Saldo Mensal</h2>
          <SaldoChart data={evolucao} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Category Chart */}
        {categorias.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Despesas por Categoria</h2>
            <CategoryChart data={categorias} />
          </div>
        )}

        {/* Sugestões */}
        {resumo?.sugestoes_investimento && resumo.sugestoes_investimento.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold">Sugestões de Investimento</h2>
            </div>
            <div className="space-y-3">
              {resumo.sugestoes_investimento.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{s.tipo}</p>
                    <p className="text-xs text-muted-foreground">{s.descricao}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-semibold text-sm text-primary">{s.percentual}%</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(s.valor_mensal)}/mês</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
