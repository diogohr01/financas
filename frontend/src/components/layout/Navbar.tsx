import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          title={darkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
