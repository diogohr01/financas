import axios from 'axios';
import { env } from '../config/env';

const COINS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'chainlink', 'avalanche-2', 'polygon'];

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 1 minute

export class CryptoService {
  async getTopCoins() {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return cache.data;
    }

    const { data } = await axios.get(`${env.COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'brl',
        ids: COINS.join(','),
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h,7d',
      },
      timeout: 10000,
    });

    const result = data.map((coin: Record<string, unknown>) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      sparkline_in_7d: coin.sparkline_in_7d,
      total_volume: coin.total_volume,
    }));

    cache = { data: result, timestamp: Date.now() };
    return result;
  }

  async getCoinDetail(coinId: string) {
    const { data } = await axios.get(`${env.COINGECKO_API_URL}/coins/${coinId}`, {
      params: { localization: false, tickers: false, community_data: false, developer_data: false },
      timeout: 10000,
    });
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      description: data.description?.pt || data.description?.en,
      current_price_brl: data.market_data?.current_price?.brl,
      ath_brl: data.market_data?.ath?.brl,
      atl_brl: data.market_data?.atl?.brl,
      circulating_supply: data.market_data?.circulating_supply,
    };
  }
}
