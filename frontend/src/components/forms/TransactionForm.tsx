import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CATEGORIAS_RECEITA, CATEGORIAS_DESPESA, Receita, Despesa } from '@/types';

type Mode = 'receita' | 'despesa';

interface TransactionFormProps {
  mode: Mode;
  initial?: Partial<Receita | Despesa>;
  onSubmit: (data: Omit<Receita | Despesa, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

export function TransactionForm({ mode, initial, onSubmit, onCancel }: TransactionFormProps) {
  const categories = mode === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
  const [descricao, setDescricao] = useState(initial?.descricao ?? '');
  const [valor, setValor] = useState(initial?.valor ? String(initial.valor) : '');
  const [categoria, setCategoria] = useState(initial?.categoria ?? categories[0]);
  const [data, setData] = useState(initial?.data ?? new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState<'fixo' | 'variavel'>(initial?.tipo ?? 'variavel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descricao || !valor || !data) { setError('Preencha todos os campos'); return; }
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) { setError('Valor inválido'); return; }
    setError('');
    setLoading(true);
    try {
      await onSubmit({ descricao, valor: valorNum, categoria, data, tipo });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">{error}</div>}

      <Input id="descricao" label="Descrição" placeholder="Ex: Salário, Aluguel..." value={descricao} onChange={e => setDescricao(e.target.value)} required />
      <Input id="valor" label="Valor (R$)" type="number" step="0.01" min="0.01" placeholder="0,00" value={valor} onChange={e => setValor(e.target.value)} required />
      <Select
        id="categoria" label="Categoria"
        options={categories.map(c => ({ value: c, label: c }))}
        value={categoria} onChange={e => setCategoria(e.target.value)}
      />
      <Input id="data" label="Data" type="date" value={data} onChange={e => setData(e.target.value)} required />
      <Select
        id="tipo" label="Tipo"
        options={[{ value: 'fixo', label: 'Fixo' }, { value: 'variavel', label: 'Variável' }]}
        value={tipo} onChange={e => setTipo(e.target.value as 'fixo' | 'variavel')}
      />

      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" loading={loading} className="flex-1">Salvar</Button>
      </div>
    </form>
  );
}
