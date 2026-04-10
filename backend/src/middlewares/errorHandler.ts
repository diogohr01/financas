import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  console.error('[ERROR]', err);
  const message = err instanceof Error ? err.message : 'Erro interno do servidor';
  res.status(500).json({ error: message });
}
