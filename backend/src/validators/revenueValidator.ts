import { z } from 'zod';

export const receitaSchema = z.object({
  descricao: z.string().min(1, 'Descrição obrigatória').max(200),
  valor: z.number().positive('Valor deve ser positivo'),
  categoria: z.enum(['Salário', 'Vale Alimentação', 'Freelance', 'Investimentos', 'Outros']),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
  tipo: z.enum(['fixo', 'variavel']),
});

export const receitaUpdateSchema = receitaSchema.partial();

export type ReceitaInput = z.infer<typeof receitaSchema>;
