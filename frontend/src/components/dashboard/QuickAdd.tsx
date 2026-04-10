import { useState } from 'react';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { useFinanceStore } from '@/store/financeStore';
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface Props {
  onAdded?: () => void;
}

export function QuickAdd({ onAdded }: Props) {
  const [mode, setMode] = useState<'despesa' | 'receita'>('despesa');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState<'fixo' | 'variavel'>('variavel');
  const [loading, setLoading] = useState(false);
  const { quickAddDespesa, quickAddReceita } = useFinanceStore();
  const { toast } = useToast();

  const categories = mode === 'despesa' ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA;

  function switchMode(m: 'despesa' | 'receita') {
    setMode(m);
    setCategoria('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao || !valor) return;
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) return;
    setLoading(true);
    try {
      const data = {
        descricao,
        valor: valorNum,
        categoria: categoria || categories[0],
        data: new Date().toISOString().split('T')[0],
        tipo,
      };
      if (mode === 'despesa') await quickAddDespesa(data);
      else await quickAddReceita(data);
      setDescricao('');
      setValor('');
      toast({ title: mode === 'despesa' ? 'Despesa adicionada!' : 'Receita adicionada!' });
      onAdded?.();
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => switchMode('despesa')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            mode === 'despesa'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'text-muted-foreground hover:bg-muted'
          )}
        >
          <TrendingDown className="w-4 h-4" /> Despesa
        </button>
        <button
          type="button"
          onClick={() => switchMode('receita')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            mode === 'receita'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'text-muted-foreground hover:bg-muted'
          )}
        >
          <TrendingUp className="w-4 h-4" /> Receita
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground mb-1 block">Descrição</label>
          <input
            className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Ex: Aluguel, Salário..."
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required
          />
        </div>
        <div className="w-32">
          <label className="text-xs text-muted-foreground mb-1 block">Valor (R$)</label>
          <input
            className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            type="number" step="0.01" min="0.01" placeholder="0,00"
            value={valor}
            onChange={e => setValor(e.target.value)}
            required
          />
        </div>
        <div className="w-40">
          <label className="text-xs text-muted-foreground mb-1 block">Categoria</label>
          <select
            className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={categoria || categories[0]}
            onChange={e => setCategoria(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="w-32">
          <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
          <select
            className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={tipo}
            onChange={e => setTipo(e.target.value as 'fixo' | 'variavel')}
          >
            <option value="variavel">Variável</option>
            <option value="fixo">Fixo (recorrente)</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'h-9 px-5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-60',
            mode === 'despesa'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          )}
        >
          <Plus className="w-4 h-4" />
          {loading ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>
    </div>
  );
}
