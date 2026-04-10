import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { RevenueService } from '../services/revenueService';
import { receitaSchema, receitaUpdateSchema } from '../validators/revenueValidator';

const service = new RevenueService();

export const revenueController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { categoria, tipo, data_inicio, data_fim } = req.query as Record<string, string>;
      const data = await service.getAll(req.user!.id, { categoria, tipo, data_inicio, data_fim });
      res.json({ data });
    } catch (e) { next(e); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getById(req.params.id, req.user!.id);
      res.json({ data });
    } catch (e) { next(e); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = receitaSchema.parse(req.body);
      const data = await service.create(req.user!.id, input);
      res.status(201).json({ data, message: 'Receita criada com sucesso' });
    } catch (e) { next(e); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = receitaUpdateSchema.parse(req.body);
      const data = await service.update(req.params.id, req.user!.id, input);
      res.json({ data, message: 'Receita atualizada com sucesso' });
    } catch (e) { next(e); }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.user!.id);
      res.json({ message: 'Receita removida com sucesso' });
    } catch (e) { next(e); }
  },

  async getMonthly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();
      const data = await service.getMonthlyData(req.user!.id, year);
      res.json({ data });
    } catch (e) { next(e); }
  },
};
