import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { DashboardService } from '../services/dashboardService';

const service = new DashboardService();

export const dashboardController = {
  async getResumo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getResumo(req.user!.id);
      res.json({ data });
    } catch (e) { next(e); }
  },

  async getEvolucao(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();
      const data = await service.getEvolucaoAnual(req.user!.id, year);
      res.json({ data });
    } catch (e) { next(e); }
  },
};
