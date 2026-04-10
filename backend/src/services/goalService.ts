import { GoalRepository } from '../repositories/goalRepository';
import { MetaInput } from '../validators/goalValidator';

const repo = new GoalRepository();

export class GoalService {
  async getAll(userId: string) {
    return repo.findAll(userId);
  }

  async getById(id: string, userId: string) {
    return repo.findById(id, userId);
  }

  async create(userId: string, input: MetaInput) {
    return repo.create(userId, input);
  }

  async update(id: string, userId: string, input: Partial<MetaInput>) {
    const meta = await repo.update(id, userId, input);
    // Auto-complete goal if valor_atual >= valor_meta
    if (meta.valor_atual >= meta.valor_meta && meta.status === 'ativa') {
      return repo.update(id, userId, { status: 'concluida' });
    }
    return meta;
  }

  async addDeposit(id: string, userId: string, valor: number) {
    const meta = await repo.findById(id, userId);
    const novoValor = Math.min(Number(meta.valor_atual) + valor, Number(meta.valor_meta));
    return this.update(id, userId, { valor_atual: novoValor });
  }

  async delete(id: string, userId: string) {
    return repo.delete(id, userId);
  }
}
