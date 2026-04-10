export interface Receita {
  id: string;
  user_id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'fixo' | 'variavel';
  created_at: string;
  updated_at: string;
}

export interface Despesa {
  id: string;
  user_id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'fixo' | 'variavel';
  created_at: string;
  updated_at: string;
}

export interface Meta {
  id: string;
  user_id: string;
  nome: string;
  valor_meta: number;
  valor_atual: number;
  prazo: string;
  status: 'ativa' | 'concluida' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export interface Simulacao {
  id: string;
  user_id: string;
  nome: string;
  tipo: 'poupanca' | 'cdb' | 'tesouro' | 'acoes' | 'cripto';
  valor_inicial: number;
  valor_mensal: number;
  tempo_meses: number;
  taxa_anual: number;
  resultado: number;
  lucro: number;
  dados_grafico: SimulacaoPonto[];
  created_at: string;
}

export interface SimulacaoPonto {
  mes: number;
  valor: number;
  aporte_total: number;
  rendimento: number;
}

export interface Previsao {
  id: string;
  user_id: string;
  texto: string;
  tipo: string;
  data: string;
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

export interface EvolucaoMensal {
  mes: number;
  nome: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface CryptoMoeda {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: { price: number[] };
  total_volume: number;
}

export const CATEGORIAS_RECEITA = ['Salário', 'Vale Alimentação', 'Freelance', 'Investimentos', 'Outros'] as const;
export const CATEGORIAS_DESPESA = ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Assinaturas', 'Investimentos', 'Saúde', 'Outros'] as const;
export const TIPOS_INVESTIMENTO = [
  { value: 'poupanca', label: 'Poupança', taxa: 6.17 },
  { value: 'cdb', label: 'CDB', taxa: 11.5 },
  { value: 'tesouro', label: 'Tesouro Direto', taxa: 10.5 },
  { value: 'acoes', label: 'Ações', taxa: 15.0 },
  { value: 'cripto', label: 'Criptomoedas', taxa: 40.0 },
] as const;
