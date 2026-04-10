import { useEffect, useState } from 'react';
import { Brain, Sparkles, RefreshCw, Lightbulb } from 'lucide-react';
import { previsaoService } from '@/services/financeService';
import { Previsao } from '@/types';
import { Button } from '@/components/ui/Button';

export default function AIPredictions() {
  const [previsoes, setPrevisoes] = useState<Previsao[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const data = await previsaoService.getAll();
    setPrevisoes(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const data = await previsaoService.generate();
      setPrevisoes(data);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Previsões Financeiras com IA</h2>
            <p className="text-sm text-muted-foreground">Análise baseada nas suas receitas, despesas e metas</p>
          </div>
        </div>
        <Button onClick={handleGenerate} loading={generating} className="gap-2">
          <Sparkles className="w-4 h-4" />
          {previsoes.length > 0 ? 'Gerar novas previsões' : 'Gerar previsões'}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : previsoes.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhuma previsão gerada ainda</p>
          <p className="text-sm mt-1">Clique em "Gerar previsões" para analisar seus dados financeiros</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{previsoes.length} previsões geradas</p>
            <button onClick={fetch} className="text-sm text-primary hover:underline flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Atualizar
            </button>
          </div>
          {previsoes.map((p, i) => (
            <div key={p.id} className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Previsão {i + 1}</p>
                <p className="text-sm leading-relaxed">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
