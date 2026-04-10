import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { ExpenseService } from '../services/expenseService';
import { despesaSchema, despesaUpdateSchema } from '../validators/expenseValidator';

const service = new ExpenseService();

export const expenseController = {
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
      const input = despesaSchema.parse(req.body);
      const data = await service.create(req.user!.id, input);
      res.status(201).json({ data, message: 'Despesa criada com sucesso' });
    } catch (e) { next(e); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = despesaUpdateSchema.parse(req.body);
      const data = await service.update(req.params.id, req.user!.id, input);
      res.json({ data, message: 'Despesa atualizada com sucesso' });
    } catch (e) { next(e); }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.user!.id);
      res.json({ message: 'Despesa removida com sucesso' });
    } catch (e) { next(e); }
  },

  async getMonthly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();
      const data = await service.getMonthlyData(req.user!.id, year);
      res.json({ data });
    } catch (e) { next(e); }
  },

  async getByCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();
      const month = req.query.month ? Number(req.query.month) : undefined;
      const data = await service.getCategoryData(req.user!.id, year, month);
      res.json({ data });
    } catch (e) { next(e); }
  },
};
