import { Coin } from 'domain/coins';
import { CoinRepository } from 'domain/coins/repository';
import CoingeckoAPI, {
  CoinGeckoListEntry,
  CoinGeckoListResponse,
  CoinGeckoResponse,
  CoinGeckoTopListEntry,
  CoinGeckoTopListResponse,
} from 'infra/coingecko/api';

export const mapCoinGeckoListEntry = (entry: CoinGeckoListEntry) => {
  return {
    id: entry.id as string,
    symbol: entry.symbol as string,
    name: entry.name as string,
  };
};

export const mapCoinGeckoListResponse = (response: CoinGeckoListResponse) => {
  return response.map(mapCoinGeckoListEntry);
};

export const mapCoinGeckoTopListEntry = (entry: CoinGeckoTopListEntry) => {
  return {
    id: entry.id as string,
    symbol: entry.symbol as string,
    name: entry.name as string,
    quoteCurrency: 'usd',
    rank: entry.market_cap_rank as number,
    marketCap: entry.market_cap as number,
    ath: entry.ath as number,
    athDate: entry.ath_date ? new Date(entry.ath_date) : undefined,
    price: entry.current_price as number,
    priceChange24h: entry.price_change_24h as number,
    percentageChange24h: entry.price_change_percentage_24h as number,
    imageUrl: entry.image,
  };
};

export const mapCoinGeckoTopListResponse = (
  response: CoinGeckoTopListResponse | null,
) => {
  if (!response) {
    return [];
  }

  return response.map(mapCoinGeckoTopListEntry);
};

export const mapCoinGeckoCoin = (response: CoinGeckoResponse) => {
  return {
    id: response.id as string,
    symbol: response.symbol as string,
    name: response.name as string,
    quoteCurrency: 'usd',
    rank: response?.market_cap_rank as number,
    marketCap: response?.market_data?.market_cap?.usd as number,
    ath: response?.market_data?.ath?.usd as number,
    athDate: response?.market_data?.ath_date?.usd
      ? new Date(response?.market_data?.ath_date?.usd)
      : undefined,
    price: response?.market_data?.current_price?.usd as number,
    priceChange24h: response.market_data?.price_change_24h_in_currency
      ?.usd as number,
    percentageChange24h: response.market_data
      ?.price_change_percentage_24h_in_currency?.usd as number,
    percentageChange7d: response.market_data
      ?.price_change_percentage_7d_in_currency?.usd as number,
    website: response.links?.homepage?.shift(),
    imageUrl: response.image?.large,
  };
};

class CoingeckoCoinRepository implements CoinRepository {
  public getCoins = async () => {
    const data = await CoingeckoAPI.fetchList();
    const coins = Coin.fromArray(mapCoinGeckoListResponse(data));
    if (!coins.length) {
      return [];
    }

    return coins;
  };

  public getCoinsTop = async () => {
    const data = await CoingeckoAPI.fetchTopList();
    const coins = Coin.fromArray(mapCoinGeckoTopListResponse(data));
    if (!coins.length) {
      return [];
    }

    return coins
      .filter((coin) => coin.rank !== null)
      .sort((a, b) => ((a.rank as number) > (b.rank as number) ? 1 : -1))
      .slice(0, 100);
  };

  public find = async (q: string): Promise<Coin | null> => {
    const coins = await this.getCoins();
    if (!coins.length) {
      return null;
    }

    const query = q.toLowerCase();
    const coinById = coins.find((coin) => coin.id.toLowerCase() === query);
    if (coinById) {
      return this.enrichCoin(coinById);
    }

    const coinBySymbol = coins.find(
      (coin) => coin.symbol.toLowerCase() === query,
    );
    if (coinBySymbol) {
      return this.enrichCoin(coinBySymbol);
    }

    const coinByName = coins.find(
      (value) => value.name.toLowerCase() === query,
    );
    if (coinByName) {
      return this.enrichCoin(coinByName);
    }

    return null;
  };

  public findById = async (id: string): Promise<Coin | null> => {
    const coins = await this.getCoins();
    if (!coins.length) {
      return null;
    }

    const coin = coins.find((value) => value.id === id);
    if (!coin) {
      return null;
    }

    return this.enrichCoin(coin);
  };

  private enrichCoin = async (coin: Coin) => {
    try {
      const data = await CoingeckoAPI.fetchById(coin.id);
      if (data) {
        return new Coin(mapCoinGeckoCoin(data));
      }
    } catch {
      console.error(
        `Could not enrich data for coin ${coin.name} (${coin.symbol})`,
      );
    }

    return null;
  };
}

export default new CoingeckoCoinRepository();
