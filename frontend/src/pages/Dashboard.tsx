import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { EvolucaoChart, SaldoChart, CategoryChart } from '@/components/charts/FinanceCharts';
import { dashboardService, despesaService } from '@/services/financeService';
import { EvolucaoMensal } from '@/types';
import { useFinanceStore } from '@/store/financeStore';
import { QuickAdd } from '@/components/dashboard/QuickAdd';
import { SalaryPlanner } from '@/components/dashboard/SalaryPlanner';

export default function Dashboard() {
  const { resumo, categorias, loadingResumo, refreshResumo } = useFinanceStore();
  const [evolucao, setEvolucao] = useState<EvolucaoMensal[]>([]);
  const [loadingEvolucao, setLoadingEvolucao] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!resumo) refreshResumo();
    dashboardService.getEvolucao(year).then(setEvolucao).finally(() => setLoadingEvolucao(false));
    // Also load categorias if store is empty
    if (categorias.length === 0) {
      despesaService.getByCategory(year);
    }
  }, []);

  const loading = loadingResumo && !resumo;

  if (loading || loadingEvolucao) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <QuickAdd />

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
        <StatCard title="Saldo Atual" value={resumo?.saldo ?? 0} icon={Wallet} color={resumo?.saldo !== undefined && resumo.saldo >= 0 ? 'green' : 'red'} />
        <StatCard title="Total Recebido" value={resumo?.total_receitas ?? 0} icon={TrendingUp} color="green" />
        <StatCard title="Total Gasto" value={resumo?.total_despesas ?? 0} icon={TrendingDown} color="red" />
        <StatCard title="Economia Mensal" value={resumo?.economia_mensal ?? 0} icon={PiggyBank} color="blue" />
      </div>

      {/* Salary Planner 50/30/20 */}
      {resumo && categorias.length > 0 && (
        <SalaryPlanner resumo={resumo} categorias={categorias} />
      )}

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

      {categorias.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Despesas por Categoria</h2>
          <CategoryChart data={categorias} />
        </div>
      )}
    </div>
  );
}
