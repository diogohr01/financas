import { RevenueRepository } from '../repositories/revenueRepository';
import { ReceitaInput } from '../validators/revenueValidator';

const repo = new RevenueRepository();

export class RevenueService {
  async getAll(userId: string, filters?: Record<string, string>) {
    return repo.findAll(userId, filters);
  }

  async getById(id: string, userId: string) {
    return repo.findById(id, userId);
  }

  async create(userId: string, input: ReceitaInput) {
    return repo.create(userId, input);
  }

  async update(id: string, userId: string, input: Partial<ReceitaInput>) {
    return repo.update(id, userId, input);
  }

  async delete(id: string, userId: string) {
    return repo.delete(id, userId);
  }

  async getMonthlyData(userId: string, year: number) {
    const rows = await repo.sumByMonth(userId, year);
    const months = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, total: 0 }));
    for (const row of rows) {
      const month = new Date(row.data).getMonth();
      months[month].total += Number(row.valor);
    }
    return months;
  }
}
