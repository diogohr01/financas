import { z } from 'zod';

export const metaSchema = z.object({
  nome: z.string().min(1).max(200),
  valor_meta: z.number().positive(),
  valor_atual: z.number().min(0).default(0),
  prazo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  status: z.enum(['ativa', 'concluida', 'cancelada']).default('ativa'),
});

export const metaUpdateSchema = metaSchema.partial();
export type MetaInput = z.infer<typeof metaSchema>;
