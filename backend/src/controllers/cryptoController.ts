import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { CryptoService } from '../services/cryptoService';

const service = new CryptoService();

export const cryptoController = {
  async getTopCoins(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getTopCoins();
      res.json({ data });
    } catch (e) { next(e); }
  },

  async getCoinDetail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.getCoinDetail(req.params.coinId);
      res.json({ data });
    } catch (e) { next(e); }
  },
};
