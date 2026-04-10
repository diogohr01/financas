import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import {
  LayoutDashboard, TrendingUp, TrendingDown, Target,
  Calculator, Bitcoin, Brain, FileText, LogOut, X, DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/receitas', icon: TrendingUp, label: 'Receitas' },
  { to: '/despesas', icon: TrendingDown, label: 'Despesas' },
  { to: '/metas', icon: Target, label: 'Metas' },
  { to: '/simulacoes', icon: Calculator, label: 'Simulações' },
  { to: '/crypto', icon: Bitcoin, label: 'Criptomoedas' },
  { to: '/previsoes', icon: Brain, label: 'Previsões IA' },
  { to: '/relatorios', icon: FileText, label: 'Relatórios' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { signOut, user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside className={cn(
        'fixed left-0 top-0 z-30 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">FinanceApp</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User */}
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted-foreground">Logado como</p>
          <p className="text-sm font-medium truncate">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
