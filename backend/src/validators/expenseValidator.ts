import { z } from 'zod';

export const despesaSchema = z.object({
  descricao: z.string().min(1, 'Descrição obrigatória').max(200),
  valor: z.number().positive('Valor deve ser positivo'),
  categoria: z.enum(['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Assinaturas', 'Investimentos', 'Saúde', 'Outros']),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
  tipo: z.enum(['fixo', 'variavel']),
});

export const despesaUpdateSchema = despesaSchema.partial();

export type DespesaInput = z.infer<typeof despesaSchema>;
