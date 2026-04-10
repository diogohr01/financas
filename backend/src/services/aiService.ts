import axios from 'axios';
import { env } from '../config/env';
import { ResumoFinanceiro, SugestaoInvestimento } from '../types';

export class AIService {
  async gerarPrevisoes(resumo: ResumoFinanceiro): Promise<string[]> {
    const { total_receitas, total_despesas, saldo, economia_mensal } = resumo;

    // If no AI key, use built-in rule-based predictions
    if (!env.AI_API_KEY) {
      return this.gerarPrevisoesLocais(resumo);
    }

    const prompt = `Você é um consultor financeiro pessoal brasileiro. Analise os dados financeiros abaixo e gere 5 previsões e sugestões práticas em português, em tom amigável e objetivo. Responda apenas com uma lista numerada.

Dados financeiros:
- Receita mensal total: R$ ${total_receitas.toFixed(2)}
- Despesas mensais: R$ ${total_despesas.toFixed(2)}
- Saldo atual: R$ ${saldo.toFixed(2)}
- Economia mensal: R$ ${economia_mensal.toFixed(2)}
- Taxa de poupança: ${total_receitas > 0 ? ((economia_mensal / total_receitas) * 100).toFixed(1) : 0}%

Gere previsões realistas sobre: quanto poupará em 6 e 12 meses, quando atingirá uma reserva de emergência (6x despesas mensais), sugestões de onde investir, e alertas sobre gastos.`;

    try {
      const { data } = await axios.post(
        `${env.AI_API_URL}/chat/completions`,
        {
          model: env.AI_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${env.AI_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://finance-app.com',
          },
          timeout: 30000,
        }
      );

      const text: string = data.choices?.[0]?.message?.content || '';
      return text
        .split('\n')
        .filter((l: string) => l.trim().match(/^\d+\./))
        .map((l: string) => l.replace(/^\d+\.\s*/, '').trim())
        .filter((l: string) => l.length > 0);
    } catch {
      return this.gerarPrevisoesLocais(resumo);
    }
  }

  private gerarPrevisoesLocais(resumo: ResumoFinanceiro): string[] {
    const { total_receitas, total_despesas, saldo, economia_mensal } = resumo;
    const previsoes: string[] = [];
    const taxaPoupanca = total_receitas > 0 ? (economia_mensal / total_receitas) * 100 : 0;
    const reservaEmergencia = total_despesas * 6;

    if (economia_mensal > 0) {
      previsoes.push(`Em 6 meses, você pode acumular R$ ${(economia_mensal * 6).toFixed(2)} poupando R$ ${economia_mensal.toFixed(2)}/mês.`);
      previsoes.push(`Em 12 meses, você pode acumular R$ ${(economia_mensal * 12).toFixed(2)} mantendo o ritmo atual.`);
    }

    if (reservaEmergencia > saldo && economia_mensal > 0) {
      const meses = Math.ceil((reservaEmergencia - saldo) / economia_mensal);
      previsoes.push(`Você atingirá sua reserva de emergência (R$ ${reservaEmergencia.toFixed(2)}) em aproximadamente ${meses} meses.`);
    } else if (saldo >= reservaEmergencia) {
      previsoes.push(`Parabéns! Você já tem sua reserva de emergência (6x despesas = R$ ${reservaEmergencia.toFixed(2)}).`);
    }

    if (taxaPoupanca >= 20) {
      previsoes.push(`Excelente! Você está poupando ${taxaPoupanca.toFixed(1)}% da renda. Considere investir em renda variável para maior rentabilidade.`);
    } else if (taxaPoupanca >= 10) {
      previsoes.push(`Você está poupando ${taxaPoupanca.toFixed(1)}% da renda. Tente aumentar para 20% reduzindo despesas variáveis.`);
    } else if (total_receitas > 0) {
      previsoes.push(`Sua taxa de poupança está em ${taxaPoupanca.toFixed(1)}%. Revise despesas para aumentar sua capacidade de investimento.`);
    }

    if (total_despesas > total_receitas * 0.8) {
      previsoes.push(`Atenção: suas despesas representam ${((total_despesas / total_receitas) * 100).toFixed(1)}% da renda. Revise gastos para ter mais folga financeira.`);
    }

    if (previsoes.length === 0) {
      previsoes.push('Registre suas receitas e despesas para receber previsões personalizadas.');
    }

    return previsoes;
  }

  gerarSugestoes(resumo: ResumoFinanceiro): SugestaoInvestimento[] {
    const { economia_mensal, total_receitas } = resumo;
    if (economia_mensal <= 0) return [];

    const taxaPoupanca = total_receitas > 0 ? economia_mensal / total_receitas : 0;

    // Conservative profile: < 10% savings rate
    if (taxaPoupanca < 0.1) {
      return [
        { tipo: 'Poupança / Tesouro Selic', percentual: 80, valor_mensal: economia_mensal * 0.8, descricao: 'Liquidez e segurança para reserva de emergência' },
        { tipo: 'CDB', percentual: 20, valor_mensal: economia_mensal * 0.2, descricao: 'Rentabilidade superior à poupança com proteção FGC' },
      ];
    }

    // Moderate profile: 10-25%
    if (taxaPoupanca < 0.25) {
      return [
        { tipo: 'Renda Fixa (CDB/Tesouro)', percentual: 50, valor_mensal: economia_mensal * 0.5, descricao: 'Base sólida com boa rentabilidade' },
        { tipo: 'Renda Variável (Ações/ETFs)', percentual: 30, valor_mensal: economia_mensal * 0.3, descricao: 'Crescimento de longo prazo' },
        { tipo: 'Criptomoedas (BTC/ETH)', percentual: 20, valor_mensal: economia_mensal * 0.2, descricao: 'Alta volatilidade, alto potencial' },
      ];
    }

    // Aggressive profile: > 25%
    return [
      { tipo: 'Renda Fixa', percentual: 40, valor_mensal: economia_mensal * 0.4, descricao: 'Reserva e estabilidade' },
      { tipo: 'Ações / ETFs', percentual: 35, valor_mensal: economia_mensal * 0.35, descricao: 'Crescimento acelerado' },
      { tipo: 'Criptomoedas', percentual: 15, valor_mensal: economia_mensal * 0.15, descricao: 'Alto potencial de retorno' },
      { tipo: 'Fundos Imobiliários', percentual: 10, valor_mensal: economia_mensal * 0.1, descricao: 'Renda passiva mensal via dividendos' },
    ];
  }

  gerarAlertas(total_receitas: number, total_despesas: number, categorias: { categoria: string; total: number }[]): string[] {
    const alertas: string[] = [];

    if (total_despesas > total_receitas) {
      alertas.push('Suas despesas estão maiores que suas receitas. Revise seus gastos urgentemente.');
    }

    for (const cat of categorias) {
      const percentual = total_receitas > 0 ? (cat.total / total_receitas) * 100 : 0;
      if (cat.categoria === 'Lazer' && percentual > 20) {
        alertas.push(`Você gastou ${percentual.toFixed(1)}% da renda em Lazer. O recomendado é até 10%.`);
      }
      if (cat.categoria === 'Assinaturas' && percentual > 10) {
        alertas.push(`Suas assinaturas consomem ${percentual.toFixed(1)}% da renda. Revise quais são realmente necessárias.`);
      }
      if (cat.categoria === 'Alimentação' && percentual > 30) {
        alertas.push(`Gastos com Alimentação representam ${percentual.toFixed(1)}% da renda. Considere cozinhar mais em casa.`);
      }
    }

    return alertas;
  }
}
