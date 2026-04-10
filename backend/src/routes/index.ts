import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { revenueController } from '../controllers/revenueController';
import { expenseController } from '../controllers/expenseController';
import { goalController } from '../controllers/goalController';
import { simulationController } from '../controllers/simulationController';
import { cryptoController } from '../controllers/cryptoController';
import { dashboardController } from '../controllers/dashboardController';
import { predictionController } from '../controllers/predictionController';

const router = Router();

// Health check
router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// All routes below require authentication
router.use(authMiddleware as any);

// Dashboard
router.get('/dashboard/resumo', dashboardController.getResumo as any);
router.get('/dashboard/evolucao', dashboardController.getEvolucao as any);

// Receitas
router.get('/receitas', revenueController.getAll as any);
router.get('/receitas/mensal', revenueController.getMonthly as any);
router.get('/receitas/:id', revenueController.getById as any);
router.post('/receitas', revenueController.create as any);
router.put('/receitas/:id', revenueController.update as any);
router.delete('/receitas/:id', revenueController.delete as any);

// Despesas
router.get('/despesas', expenseController.getAll as any);
router.get('/despesas/mensal', expenseController.getMonthly as any);
router.get('/despesas/categorias', expenseController.getByCategory as any);
router.get('/despesas/:id', expenseController.getById as any);
router.post('/despesas', expenseController.create as any);
router.put('/despesas/:id', expenseController.update as any);
router.delete('/despesas/:id', expenseController.delete as any);

// Metas
router.get('/metas', goalController.getAll as any);
router.post('/metas', goalController.create as any);
router.put('/metas/:id', goalController.update as any);
router.post('/metas/:id/deposito', goalController.addDeposit as any);
router.delete('/metas/:id', goalController.delete as any);

// Simulações
router.get('/simulacoes', simulationController.getAll as any);
router.get('/simulacoes/taxas', simulationController.getTaxas as any);
router.post('/simulacoes/calcular', simulationController.calcular as any);
router.post('/simulacoes', simulationController.save as any);
router.delete('/simulacoes/:id', simulationController.delete as any);

// Previsões IA
router.get('/previsoes', predictionController.getAll as any);
router.post('/previsoes/gerar', predictionController.generate as any);

// Criptomoedas (no auth required for public data, but keeping auth for rate limiting)
router.get('/crypto', cryptoController.getTopCoins as any);
router.get('/crypto/:coinId', cryptoController.getCoinDetail as any);

export default router;
