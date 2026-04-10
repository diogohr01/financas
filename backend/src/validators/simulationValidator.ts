import { z } from 'zod';

export const simulacaoSchema = z.object({
  nome: z.string().min(1).max(200).default('Simulação'),
  tipo: z.enum(['poupanca', 'cdb', 'tesouro', 'acoes', 'cripto']),
  valor_inicial: z.number().min(0),
  valor_mensal: z.number().min(0),
  tempo_meses: z.number().int().positive().max(600),
  taxa_anual: z.number().min(0).max(100),
});

export type SimulacaoInput = z.infer<typeof simulacaoSchema>;
