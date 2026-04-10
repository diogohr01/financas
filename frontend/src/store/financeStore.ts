import { create } from 'zustand';
import { ResumoFinanceiro, Despesa, Receita } from '@/types';
import { dashboardService, despesaService, receitaService } from '@/services/financeService';

interface FinanceState {
  resumo: ResumoFinanceiro | null;
  categorias: { categoria: string; total: number }[];
  loadingResumo: boolean;
  refreshResumo: () => Promise<void>;
  quickAddDespesa: (d: Omit<Despesa, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  quickAddReceita: (r: Omit<Receita, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  resumo: null,
  categorias: [],
  loadingResumo: false,

  refreshResumo: async () => {
    set({ loadingResumo: true });
    const year = new Date().getFullYear();
    const [resumo, categorias] = await Promise.all([
      dashboardService.getResumo(),
      despesaService.getByCategory(year),
    ]);
    set({ resumo, categorias, loadingResumo: false });
  },

  quickAddDespesa: async (data) => {
    await despesaService.create(data);
    await get().refreshResumo();
  },

  quickAddReceita: async (data) => {
    await receitaService.create(data);
    await get().refreshResumo();
  },
}));
