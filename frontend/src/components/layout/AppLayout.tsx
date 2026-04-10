import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/receitas': 'Receitas',
  '/despesas': 'Despesas',
  '/metas': 'Metas Financeiras',
  '/simulacoes': 'Simulação de Investimentos',
  '/crypto': 'Criptomoedas',
  '/previsoes': 'Previsões com IA',
  '/relatorios': 'Relatórios',
};

export function AppLayout() {
  const { sidebarOpen } = useUIStore();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'FinanceApp';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className={cn(
        'flex flex-col flex-1 overflow-hidden transition-all duration-300',
        'lg:ml-64'
      )}>
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
