import api from '@/lib/api';
import { Receita, Despesa, Meta, Simulacao, Previsao, ResumoFinanceiro, EvolucaoMensal, CryptoMoeda } from '@/types';

// Dashboard
export const dashboardService = {
  getResumo: () => api.get<{ data: ResumoFinanceiro }>('/dashboard/resumo').then(r => r.data.data),
  getEvolucao: (year?: number) => api.get<{ data: EvolucaoMensal[] }>('/dashboard/evolucao', { params: { year } }).then(r => r.data.data),
};

// Receitas
export const receitaService = {
  getAll: (params?: Record<string, string>) => api.get<{ data: Receita[] }>('/receitas', { params }).then(r => r.data.data),
  create: (data: Omit<Receita, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => api.post<{ data: Receita }>('/receitas', data).then(r => r.data.data),
  update: (id: string, data: Partial<Receita>) => api.put<{ data: Receita }>(`/receitas/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/receitas/${id}`),
  getMonthly: (year?: number) => api.get<{ data: { mes: number; total: number }[] }>('/receitas/mensal', { params: { year } }).then(r => r.data.data),
};

// Despesas
export const despesaService = {
  getAll: (params?: Record<string, string>) => api.get<{ data: Despesa[] }>('/despesas', { params }).then(r => r.data.data),
  create: (data: Omit<Despesa, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => api.post<{ data: Despesa }>('/despesas', data).then(r => r.data.data),
  update: (id: string, data: Partial<Despesa>) => api.put<{ data: Despesa }>(`/despesas/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/despesas/${id}`),
  getMonthly: (year?: number) => api.get<{ data: { mes: number; total: number }[] }>('/despesas/mensal', { params: { year } }).then(r => r.data.data),
  getByCategory: (year?: number, month?: number) => api.get<{ data: { categoria: string; total: number }[] }>('/despesas/categorias', { params: { year, month } }).then(r => r.data.data),
};

// Metas
export const metaService = {
  getAll: () => api.get<{ data: Meta[] }>('/metas').then(r => r.data.data),
  create: (data: Omit<Meta, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => api.post<{ data: Meta }>('/metas', data).then(r => r.data.data),
  update: (id: string, data: Partial<Meta>) => api.put<{ data: Meta }>(`/metas/${id}`, data).then(r => r.data.data),
  addDeposit: (id: string, valor: number) => api.post<{ data: Meta }>(`/metas/${id}/deposito`, { valor }).then(r => r.data.data),
  delete: (id: string) => api.delete(`/metas/${id}`),
};

// Simulações
export const simulacaoService = {
  getAll: () => api.get<{ data: Simulacao[] }>('/simulacoes').then(r => r.data.data),
  calcular: (data: unknown) => api.post<{ data: { resultado: number; lucro: number; dados_grafico: unknown[] } }>('/simulacoes/calcular', data).then(r => r.data.data),
  save: (data: unknown) => api.post<{ data: Simulacao }>('/simulacoes', data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/simulacoes/${id}`),
  getTaxas: () => api.get<{ data: Record<string, number> }>('/simulacoes/taxas').then(r => r.data.data),
};

// Previsões
export const previsaoService = {
  getAll: () => api.get<{ data: Previsao[] }>('/previsoes').then(r => r.data.data),
  generate: () => api.post<{ data: Previsao[] }>('/previsoes/gerar').then(r => r.data.data),
};

// Cripto
export const cryptoService = {
  getTopCoins: () => api.get<{ data: CryptoMoeda[] }>('/crypto').then(r => r.data.data),
  getCoinDetail: (coinId: string) => api.get<{ data: unknown }>(`/crypto/${coinId}`).then(r => r.data.data),
};
