import { SimulationRepository } from '../repositories/simulationRepository';
import { SimulacaoInput } from '../validators/simulationValidator';
import { SimulacaoPonto } from '../types';

const repo = new SimulationRepository();

// Default annual rates for each investment type
const TAXAS_PADRAO: Record<string, number> = {
  poupanca: 6.17,
  cdb: 11.5,
  tesouro: 10.5,
  acoes: 15.0,
  cripto: 40.0,
};

export class SimulationService {
  calcular(input: SimulacaoInput) {
    const taxaAnual = input.taxa_anual > 0 ? input.taxa_anual : TAXAS_PADRAO[input.tipo];
    const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;

    let saldo = input.valor_inicial;
    const pontos: SimulacaoPonto[] = [];
    let aporteTotal = input.valor_inicial;

    for (let mes = 1; mes <= input.tempo_meses; mes++) {
      saldo = saldo * (1 + taxaMensal) + input.valor_mensal;
      aporteTotal += input.valor_mensal;
      pontos.push({
        mes,
        valor: Math.round(saldo * 100) / 100,
        aporte_total: Math.round(aporteTotal * 100) / 100,
        rendimento: Math.round((saldo - aporteTotal) * 100) / 100,
      });
    }

    const resultado = Math.round(saldo * 100) / 100;
    const lucro = Math.round((saldo - aporteTotal) * 100) / 100;

    return { resultado, lucro, dados_grafico: pontos, taxa_anual: taxaAnual };
  }

  async save(userId: string, input: SimulacaoInput) {
    const calc = this.calcular(input);
    return repo.create(userId, {
      ...input,
      taxa_anual: calc.taxa_anual,
      resultado: calc.resultado,
      lucro: calc.lucro,
      dados_grafico: calc.dados_grafico,
    });
  }

  async getAll(userId: string) {
    return repo.findAll(userId);
  }

  async delete(id: string, userId: string) {
    return repo.delete(id, userId);
  }

  getTaxasPadrao() {
    return TAXAS_PADRAO;
  }
}
