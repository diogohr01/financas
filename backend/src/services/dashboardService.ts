import { supabase } from '../config/supabase';
import { AIService } from './aiService';

const aiService = new AIService();

export class DashboardService {
  async getResumo(userId: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const startOfMonth = `${year}-${month}-01`;
    const endOfMonth = new Date(year, now.getMonth() + 1, 0).toISOString().split('T')[0];

    const [receitasRes, despesasRes, despesasCategoria] = await Promise.all([
      supabase.from('receitas').select('valor').eq('user_id', userId).gte('data', startOfMonth).lte('data', endOfMonth),
      supabase.from('despesas').select('valor').eq('user_id', userId).gte('data', startOfMonth).lte('data', endOfMonth),
      supabase.from('despesas').select('valor, categoria').eq('user_id', userId).gte('data', startOfMonth).lte('data', endOfMonth),
    ]);

    const total_receitas = (receitasRes.data || []).reduce((s, r) => s + Number(r.valor), 0);
    const total_despesas = (despesasRes.data || []).reduce((s, r) => s + Number(r.valor), 0);
    const saldo = total_receitas - total_despesas;
    const economia_mensal = saldo;

    const categorias: Record<string, number> = {};
    for (const d of despesasCategoria.data || []) {
      categorias[d.categoria] = (categorias[d.categoria] || 0) + Number(d.valor);
    }
    const categoriasArray = Object.entries(categorias).map(([categoria, total]) => ({ categoria, total }));

    const alertas = aiService.gerarAlertas(total_receitas, total_despesas, categoriasArray);
    const resumo = { total_receitas, total_despesas, saldo, economia_mensal, alertas, sugestoes_investimento: [] };
    resumo.sugestoes_investimento = aiService.gerarSugestoes(resumo);

    return resumo;
  }

  async getEvolucaoAnual(userId: string, year: number) {
    const [receitas, despesas] = await Promise.all([
      supabase.from('receitas').select('data, valor').eq('user_id', userId).gte('data', `${year}-01-01`).lte('data', `${year}-12-31`),
      supabase.from('despesas').select('data, valor').eq('user_id', userId).gte('data', `${year}-01-01`).lte('data', `${year}-12-31`),
    ]);

    const meses = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      nome: new Date(year, i).toLocaleString('pt-BR', { month: 'short' }),
      receitas: 0,
      despesas: 0,
      saldo: 0,
    }));

    for (const r of receitas.data || []) {
      const m = new Date(r.data).getMonth();
      meses[m].receitas += Number(r.valor);
    }
    for (const d of despesas.data || []) {
      const m = new Date(d.data).getMonth();
      meses[m].despesas += Number(d.valor);
    }
    for (const m of meses) {
      m.saldo = m.receitas - m.despesas;
    }

    return meses;
  }
}
