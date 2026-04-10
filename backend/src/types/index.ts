export interface Receita {
  id?: string;
  user_id?: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'fixo' | 'variavel';
  created_at?: string;
  updated_at?: string;
}

export interface Despesa {
  id?: string;
  user_id?: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'fixo' | 'variavel';
  created_at?: string;
  updated_at?: string;
}

export interface Meta {
  id?: string;
  user_id?: string;
  nome: string;
  valor_meta: number;
  valor_atual: number;
  prazo: string;
  status: 'ativa' | 'concluida' | 'cancelada';
  created_at?: string;
  updated_at?: string;
}

export interface Simulacao {
  id?: string;
  user_id?: string;
  nome: string;
  tipo: 'poupanca' | 'cdb' | 'tesouro' | 'acoes' | 'cripto';
  valor_inicial: number;
  valor_mensal: number;
  tempo_meses: number;
  taxa_anual: number;
  resultado?: number;
  lucro?: number;
  dados_grafico?: SimulacaoPonto[];
  created_at?: string;
}

export interface SimulacaoPonto {
  mes: number;
  valor: number;
  aporte_total: number;
  rendimento: number;
}

export interface Previsao {
  id?: string;
  user_id?: string;
  texto: string;
  tipo: string;
  data?: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: { id: string; email: string };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ResumoFinanceiro {
  total_receitas: number;
  total_despesas: number;
  saldo: number;
  economia_mensal: number;
  alertas: string[];
  sugestoes_investimento: SugestaoInvestimento[];
}

export interface SugestaoInvestimento {
  tipo: string;
  percentual: number;
  valor_mensal: number;
  descricao: string;
}
