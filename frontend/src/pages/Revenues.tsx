import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { receitaService } from '@/services/financeService';
import { Receita, CATEGORIAS_RECEITA } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Revenues() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Receita | null>(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filterCategoria) params.categoria = filterCategoria;
    if (filterTipo) params.tipo = filterTipo;
    const data = await receitaService.getAll(params);
    setReceitas(data);
    setLoading(false);
  }, [filterCategoria, filterTipo]);

  useEffect(() => { fetch(); }, [fetch]);

  const total = receitas.reduce((s, r) => s + Number(r.valor), 0);

  async function handleSubmit(data: Omit<Receita, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    if (editing) {
      await receitaService.update(editing.id, data);
    } else {
      await receitaService.create(data);
    }
    setModalOpen(false);
    setEditing(null);
    fetch();
  }

  async function handleDelete(id: string) {
    if (!confirm('Confirmar exclusão?')) return;
    await receitaService.delete(id);
    fetch();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-muted-foreground text-sm">Total filtrado</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(total)}</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Receita
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select
          options={[{ value: '', label: 'Todas categorias' }, ...CATEGORIAS_RECEITA.map(c => ({ value: c, label: c }))]}
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
        ) : receitas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <TrendingUp className="w-10 h-10 mb-2 opacity-30" />
            <p>Nenhuma receita encontrada</p>
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
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {receitas.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{r.descricao}</td>
                    <td className="p-4"><Badge>{r.categoria}</Badge></td>
                    <td className="p-4"><Badge variant={r.tipo === 'fixo' ? 'default' : 'outline'}>{r.tipo === 'fixo' ? 'Fixo' : 'Variável'}</Badge></td>
                    <td className="p-4 text-muted-foreground">{formatDate(r.data)}</td>
                    <td className="p-4 text-right font-semibold text-green-600">{formatCurrency(Number(r.valor))}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(r); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Editar Receita' : 'Nova Receita'}>
        <TransactionForm
          mode="receita"
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
