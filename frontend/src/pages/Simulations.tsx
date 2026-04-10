import { useEffect, useState } from 'react';
import { Calculator, Save, Trash2 } from 'lucide-react';
import { simulacaoService } from '@/services/financeService';
import { Simulacao, SimulacaoPonto, TIPOS_INVESTIMENTO } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SimulacaoChart } from '@/components/charts/FinanceCharts';
import { formatCurrency } from '@/lib/utils';

interface CalcResult {
  resultado: number;
  lucro: number;
  dados_grafico: SimulacaoPonto[];
  taxa_anual: number;
}

export default function Simulations() {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([]);
  const [form, setForm] = useState({ nome: 'Minha Simulação', tipo: 'cdb', valor_inicial: '1000', valor_mensal: '200', tempo_meses: '24', taxa_anual: '0' });
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    simulacaoService.getAll().then(setSimulacoes);
  }, []);

  const tipoAtual = TIPOS_INVESTIMENTO.find(t => t.value === form.tipo);

  async function handleCalcular(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await simulacaoService.calcular({
        ...form,
        valor_inicial: parseFloat(form.valor_inicial) || 0,
        valor_mensal: parseFloat(form.valor_mensal) || 0,
        tempo_meses: parseInt(form.tempo_meses),
        taxa_anual: parseFloat(form.taxa_anual) || 0,
      });
      setResult(r as CalcResult);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const saved = await simulacaoService.save({
        ...form,
        valor_inicial: parseFloat(form.valor_inicial) || 0,
        valor_mensal: parseFloat(form.valor_mensal) || 0,
        tempo_meses: parseInt(form.tempo_meses),
        taxa_anual: parseFloat(form.taxa_anual) || 0,
      }) as Simulacao;
      setSimulacoes(prev => [saved, ...prev]);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await simulacaoService.delete(id);
    setSimulacoes(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" /> Simulador
          </h2>
          <form onSubmit={handleCalcular} className="flex flex-col gap-4">
            <Input label="Nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            <Select
              label="Tipo de investimento"
              options={TIPOS_INVESTIMENTO.map(t => ({ value: t.value, label: `${t.label} (~${t.taxa}% a.a.)` }))}
              value={form.tipo}
              onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Valor inicial (R$)" type="number" min="0" step="0.01" value={form.valor_inicial} onChange={e => setForm(f => ({ ...f, valor_inicial: e.target.value }))} />
              <Input label="Aporte mensal (R$)" type="number" min="0" step="0.01" value={form.valor_mensal} onChange={e => setForm(f => ({ ...f, valor_mensal: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Tempo (meses)" type="number" min="1" max="600" value={form.tempo_meses} onChange={e => setForm(f => ({ ...f, tempo_meses: e.target.value }))} />
              <Input
                label={`Taxa a.a. (%) — padrão: ${tipoAtual?.taxa}%`}
                type="number" min="0" max="100" step="0.01"
                placeholder={String(tipoAtual?.taxa || 0)}
                value={form.taxa_anual}
                onChange={e => setForm(f => ({ ...f, taxa_anual: e.target.value }))}
              />
            </div>
            <Button type="submit" loading={loading} className="w-full">Calcular</Button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <h2 className="font-semibold">Resultado da Simulação</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="text-xs text-muted-foreground">Total acumulado</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(result.resultado)}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <p className="text-xs text-muted-foreground">Lucro estimado</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(result.lucro)}</p>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Taxa utilizada</p>
              <p className="font-semibold">{result.taxa_anual}% ao ano</p>
            </div>
            <SimulacaoChart data={result.dados_grafico} />
            <Button onClick={handleSave} loading={saving} variant="outline" className="gap-2">
              <Save className="w-4 h-4" /> Salvar Simulação
            </Button>
          </div>
        )}
      </div>

      {/* Saved simulations */}
      {simulacoes.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Simulações Salvas</h2>
          <div className="space-y-3">
            {simulacoes.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-muted rounded-xl gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{s.nome}</p>
                  <p className="text-xs text-muted-foreground">{TIPOS_INVESTIMENTO.find(t => t.value === s.tipo)?.label} · {s.tempo_meses}m · {s.taxa_anual}% a.a.</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-green-600">{formatCurrency(s.resultado)}</p>
                  <p className="text-xs text-muted-foreground">+{formatCurrency(s.lucro)}</p>
                </div>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
