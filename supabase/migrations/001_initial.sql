-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Receitas (Revenues)
CREATE TABLE IF NOT EXISTS receitas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  categoria TEXT NOT NULL DEFAULT 'Outros',
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo TEXT NOT NULL DEFAULT 'variavel' CHECK (tipo IN ('fixo', 'variavel')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Despesas (Expenses)
CREATE TABLE IF NOT EXISTS despesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  categoria TEXT NOT NULL DEFAULT 'Outros',
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo TEXT NOT NULL DEFAULT 'variavel' CHECK (tipo IN ('fixo', 'variavel')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Metas (Goals)
CREATE TABLE IF NOT EXISTS metas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor_meta NUMERIC(12,2) NOT NULL CHECK (valor_meta > 0),
  valor_atual NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (valor_atual >= 0),
  prazo DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulações (Simulations)
CREATE TABLE IF NOT EXISTS simulacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT 'Simulação',
  tipo TEXT NOT NULL,
  valor_inicial NUMERIC(12,2) NOT NULL DEFAULT 0,
  valor_mensal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tempo_meses INTEGER NOT NULL CHECK (tempo_meses > 0),
  taxa_anual NUMERIC(6,4) NOT NULL,
  resultado NUMERIC(14,2),
  lucro NUMERIC(14,2),
  dados_grafico JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Previsões IA (AI Predictions)
CREATE TABLE IF NOT EXISTS previsoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'geral',
  data TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE previsoes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users see own receitas" ON receitas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own despesas" ON despesas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own metas" ON metas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own simulacoes" ON simulacoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own previsoes" ON previsoes FOR ALL USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER receitas_updated_at BEFORE UPDATE ON receitas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER despesas_updated_at BEFORE UPDATE ON despesas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER metas_updated_at BEFORE UPDATE ON metas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
