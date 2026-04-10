import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { PredictionService } from '../services/predictionService';

const service = new PredictionService();

export const predictionController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getAll(req.user!.id);
      res.json({ data });
    } catch (e) { next(e); }
  },

  async generate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.generate(req.user!.id);
      res.json({ data, message: 'Previsões geradas com sucesso' });
    } catch (e) { next(e); }
  },
};
