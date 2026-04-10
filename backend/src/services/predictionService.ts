import { PredictionRepository } from '../repositories/predictionRepository';
import { DashboardService } from './dashboardService';
import { AIService } from './aiService';

const repo = new PredictionRepository();
const dashboardService = new DashboardService();
const aiService = new AIService();

export class PredictionService {
  async getAll(userId: string) {
    return repo.findAll(userId);
  }

  async generate(userId: string) {
    const resumo = await dashboardService.getResumo(userId);
    const previsoes = await aiService.gerarPrevisoes(resumo);

    // Delete old predictions and save new ones
    await repo.deleteAll(userId);

    const saved = await Promise.all(
      previsoes.map(texto => repo.create(userId, { texto, tipo: 'ia' }))
    );

    return saved;
  }
}
