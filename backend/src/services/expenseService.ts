import { ExpenseRepository } from '../repositories/expenseRepository';
import { DespesaInput } from '../validators/expenseValidator';

const repo = new ExpenseRepository();

export class ExpenseService {
  async getAll(userId: string, filters?: Record<string, string>) {
    return repo.findAll(userId, filters);
  }

  async getById(id: string, userId: string) {
    return repo.findById(id, userId);
  }

  async create(userId: string, input: DespesaInput) {
    return repo.create(userId, input);
  }

  async update(id: string, userId: string, input: Partial<DespesaInput>) {
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

  async getCategoryData(userId: string, year: number, month?: number) {
    const rows = await repo.sumByMonth(userId, year);
    const categoryMap: Record<string, number> = {};
    for (const row of rows) {
      const rowMonth = new Date(row.data).getMonth() + 1;
      if (!month || rowMonth === month) {
        categoryMap[row.categoria] = (categoryMap[row.categoria] || 0) + Number(row.valor);
      }
    }
    return Object.entries(categoryMap).map(([categoria, total]) => ({ categoria, total }));
  }
}
