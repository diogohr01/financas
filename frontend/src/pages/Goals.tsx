import { useEffect, useState } from 'react';
import { Plus, Trash2, Target, PlusCircle } from 'lucide-react';
import { metaService } from '@/services/financeService';
import { Meta } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, calculateProgress } from '@/lib/utils';

export default function Goals() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [depositModal, setDepositModal] = useState<string | null>(null);
  const [depositValor, setDepositValor] = useState('');
  const [form, setForm] = useState({ nome: '', valor_meta: '', valor_atual: '0', prazo: '' });

  const fetch = async () => {
    setLoading(true);
    const data = await metaService.getAll();
    setMetas(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await metaService.create({
      nome: form.nome,
      valor_meta: parseFloat(form.valor_meta),
      valor_atual: parseFloat(form.valor_atual) || 0,
      prazo: form.prazo,
      status: 'ativa',
    });
    setModalOpen(false);
    setForm({ nome: '', valor_meta: '', valor_atual: '0', prazo: '' });
    fetch();
  }

  async function handleDeposit() {
    if (!depositModal || !depositValor) return;
    await metaService.addDeposit(depositModal, parseFloat(depositValor));
    setDepositModal(null);
    setDepositValor('');
    fetch();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir meta?')) return;
    await metaService.delete(id);
    fetch();
  }

  const statusVariant = (status: Meta['status']) =>
    status === 'concluida' ? 'success' : status === 'cancelada' ? 'destructive' : 'default';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{metas.filter(m => m.status === 'ativa').length} metas ativas</p>
          <p className="text-sm text-green-600 font-medium">{metas.filter(m => m.status === 'concluida').length} concluídas</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Meta
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : metas.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-card border border-border rounded-xl">
          <Target className="w-10 h-10 mb-2 opacity-30" />
          <p>Nenhuma meta criada ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {metas.map(m => {
            const progress = calculateProgress(Number(m.valor_atual), Number(m.valor_meta));
            return (
              <div key={m.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{m.nome}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Prazo: {formatDate(m.prazo)}</p>
                  </div>
                  <Badge variant={statusVariant(m.status)}>
                    {m.status === 'ativa' ? 'Ativa' : m.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{formatCurrency(Number(m.valor_atual))}</span>
                    <span className="font-medium">{formatCurrency(Number(m.valor_meta))}</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(1)}% concluído</p>
                </div>

                <div className="flex gap-2">
                  {m.status === 'ativa' && (
                    <Button size="sm" variant="outline" onClick={() => setDepositModal(m.id)} className="flex-1 gap-1">
                      <PlusCircle className="w-3.5 h-3.5" /> Depositar
                    </Button>
                  )}
                  <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Meta Financeira">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input label="Nome da meta" placeholder="Ex: Viagem para Europa" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required />
          <Input label="Valor da meta (R$)" type="number" step="0.01" min="1" value={form.valor_meta} onChange={e => setForm(f => ({ ...f, valor_meta: e.target.value }))} required />
          <Input label="Valor inicial (R$)" type="number" step="0.01" min="0" value={form.valor_atual} onChange={e => setForm(f => ({ ...f, valor_atual: e.target.value }))} />
          <Input label="Prazo" type="date" value={form.prazo} onChange={e => setForm(f => ({ ...f, prazo: e.target.value }))} required />
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1">Criar Meta</Button>
          </div>
        </form>
      </Modal>

      {/* Deposit Modal */}
      <Modal open={!!depositModal} onClose={() => setDepositModal(null)} title="Adicionar Depósito">
        <div className="flex flex-col gap-4">
          <Input label="Valor do depósito (R$)" type="number" step="0.01" min="0.01" value={depositValor} onChange={e => setDepositValor(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDepositModal(null)} className="flex-1">Cancelar</Button>
            <Button onClick={handleDeposit} className="flex-1">Confirmar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
