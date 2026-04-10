import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { SimulationService } from '../services/simulationService';
import { simulacaoSchema } from '../validators/simulationValidator';

const service = new SimulationService();

export const simulationController = {
  async calcular(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = simulacaoSchema.parse(req.body);
      const data = service.calcular(input);
      res.json({ data });
    } catch (e) { next(e); }
  },

  async save(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = simulacaoSchema.parse(req.body);
      const data = await service.save(req.user!.id, input);
      res.status(201).json({ data, message: 'Simulação salva com sucesso' });
    } catch (e) { next(e); }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getAll(req.user!.id);
      res.json({ data });
    } catch (e) { next(e); }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id, req.user!.id);
      res.json({ message: 'Simulação removida com sucesso' });
    } catch (e) { next(e); }
  },

  async getTaxas(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({ data: service.getTaxasPadrao() });
    } catch (e) { next(e); }
  },
};
