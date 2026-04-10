import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { GoalService } from '../services/goalService';
import { metaSchema, metaUpdateSchema } from '../validators/goalValidator';
import { z } from 'zod';

const service = new GoalService();

export const goalController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getAll(req.user!.id);
      res.json({ data });
    } catch (e) { next(e); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = metaSchema.parse(req.body);
      const data = await service.create(req.user!.id, input);
      res.status(201).json({ data, message: 'Meta criada com sucesso' });
    } catch (e) { next(e); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = metaUpdateSchema.parse(req.body);
      const data = await service.update(req.params.id, req.user!.id, input);
      res.json({ data, message: 'Meta atualizada com sucesso' });
    } catch (e) { next(e); }
  },

  async addDeposit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { valor } = z.object({ valor: z.number().positive() }).parse(req.body);
      const data = await service.addDeposit(req.params.id, req.user!.id, valor);
      res.json({ data, message: 'Depósito adicionado com sucesso' });
    } catch (e) { next(e); }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.user!.id);
      res.json({ message: 'Meta removida com sucesso' });
    } catch (e) { next(e); }
  },
};
