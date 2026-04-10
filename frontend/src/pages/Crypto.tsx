import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { cryptoService } from '@/services/financeService';
import { CryptoMoeda } from '@/types';
import { Button } from '@/components/ui/Button';
import { SparklineChart } from '@/components/charts/FinanceCharts';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function Crypto() {
  const [coins, setCoins] = useState<CryptoMoeda[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await cryptoService.getTopCoins();
      setCoins(data);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {lastUpdate ? `Atualizado às ${lastUpdate.toLocaleTimeString('pt-BR')}` : 'Carregando...'}
          </p>
          <p className="text-xs text-muted-foreground">Dados: CoinGecko API · Preços em BRL</p>
        </div>
        <Button onClick={fetch} loading={loading} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading && coins.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Moeda</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Preço</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">24h</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">7d</th>
                  <th className="text-right p-4 font-medium text-muted-foreground hidden lg:table-cell">Volume 24h</th>
                  <th className="text-right p-4 font-medium text-muted-foreground hidden xl:table-cell">Market Cap</th>
                  <th className="p-4 font-medium text-muted-foreground hidden md:table-cell">7 dias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coins.map(coin => {
                  const is24hPositive = coin.price_change_percentage_24h >= 0;
                  const is7dPositive = (coin.price_change_percentage_7d_in_currency || 0) >= 0;
                  return (
                    <tr key={coin.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-muted-foreground">{coin.market_cap_rank}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-semibold">{coin.name}</p>
                            <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-semibold">{formatCurrency(coin.current_price)}</td>
                      <td className="p-4 text-right">
                        <span className={`flex items-center justify-end gap-1 font-medium ${is24hPositive ? 'text-green-600' : 'text-red-500'}`}>
                          {is24hPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {formatPercent(coin.price_change_percentage_24h)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-medium ${is7dPositive ? 'text-green-600' : 'text-red-500'}`}>
                          {formatPercent(coin.price_change_percentage_7d_in_currency || 0)}
                        </span>
                      </td>
                      <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">
                        {formatCurrency(coin.total_volume)}
                      </td>
                      <td className="p-4 text-right text-muted-foreground hidden xl:table-cell">
                        {formatCurrency(coin.market_cap)}
                      </td>
                      <td className="p-4 hidden md:table-cell w-28">
                        {coin.sparkline_in_7d?.price && (
                          <SparklineChart prices={coin.sparkline_in_7d.price} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
