import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, TrendingDown } from 'lucide-react';
import { despesaService } from '@/services/financeService';
import { useFinanceStore } from '@/store/financeStore';
import { Despesa, CATEGORIAS_DESPESA } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function Expenses() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Despesa | null>(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const { refreshResumo } = useFinanceStore();

  const fetch = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filterCategoria) params.categoria = filterCategoria;
    if (filterTipo) params.tipo = filterTipo;
    const data = await despesaService.getAll(params);
    setDespesas(data);
    setLoading(false);
  }, [filterCategoria, filterTipo]);

  useEffect(() => { fetch(); }, [fetch]);

  const total = despesas.reduce((s, d) => s + Number(d.valor), 0);
  const totalFixo = despesas.filter(d => d.tipo === 'fixo').reduce((s, d) => s + Number(d.valor), 0);

  // Category breakdown for weight bars
  const porCategoria = CATEGORIAS_DESPESA.map(cat => ({
    categoria: cat,
    total: despesas.filter(d => d.categoria === cat).reduce((s, d) => s + Number(d.valor), 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  async function handleSubmit(data: Omit<Despesa, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    if (editing) {
      await despesaService.update(editing.id, data);
    } else {
      await despesaService.create(data);
    }
    setModalOpen(false);
    setEditing(null);
    fetch();
    refreshResumo(); // sync dashboard cards
  }

  async function handleDelete(id: string) {
    if (!confirm('Confirmar exclusão?')) return;
    await despesaService.delete(id);
    fetch();
    refreshResumo(); // sync dashboard cards
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-6">
          <div>
            <p className="text-muted-foreground text-sm">Total filtrado</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(total)}</p>
          </div>
          {totalFixo > 0 && (
            <div>
              <p className="text-muted-foreground text-sm">Fixas do mês</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalFixo)}</p>
            </div>
          )}
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Despesa
        </Button>
      </div>

      {/* Category weight bars */}
      {porCategoria.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4 text-sm">Peso por categoria</h2>
          <div className="space-y-3">
            {porCategoria.map(c => {
              const pct = total > 0 ? (c.total / total) * 100 : 0;
              return (
                <div key={c.categoria} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.categoria}</span>
                    <div className="flex gap-3 text-right">
                      <span className="text-muted-foreground">{pct.toFixed(1)}%</span>
                      <span className="font-semibold text-red-600 w-24 text-right">{formatCurrency(c.total)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        pct > 40 ? 'bg-red-500' : pct > 25 ? 'bg-orange-400' : 'bg-blue-400'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select
          options={[{ value: '', label: 'Todas categorias' }, ...CATEGORIAS_DESPESA.map(c => ({ value: c, label: c }))]}
          value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}
          className="w-48"
        />
        <Select
          options={[{ value: '', label: 'Todos tipos' }, { value: 'fixo', label: 'Fixo' }, { value: 'variavel', label: 'Variável' }]}
          value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : despesas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <TrendingDown className="w-10 h-10 mb-2 opacity-30" />
            <p>Nenhuma despesa encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Descrição</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Categoria</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Valor</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">% do total</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {despesas.map(d => {
                  const pct = total > 0 ? ((Number(d.valor) / total) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{d.descricao}</td>
                      <td className="p-4"><Badge variant="destructive">{d.categoria}</Badge></td>
                      <td className="p-4">
                        <Badge variant={d.tipo === 'fixo' ? 'default' : 'outline'}>
                          {d.tipo === 'fixo' ? '🔒 Fixo' : 'Variável'}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(d.data)}</td>
                      <td className="p-4 text-right font-semibold text-red-600">{formatCurrency(Number(d.valor))}</td>
                      <td className="p-4 text-right">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{pct}%</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditing(d); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Editar Despesa' : 'Nova Despesa'}>
        <TransactionForm
          mode="despesa"
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
