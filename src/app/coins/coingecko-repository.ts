import { differenceInHours } from 'date-fns';
import { Coin } from 'domain/coins';
import { CoinRepository } from 'domain/coins/repository';
import CoingeckoAPI, {
  CoinGeckoListEntry,
  CoinGeckoListResponse,
  CoinGeckoResponse,
} from 'infra/coingecko/api';

const COINS_LIST_CACHE_HOURS = 6;

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
    percentageChange24h: response.market_data
      ?.price_change_percentage_24h_in_currency?.usd as number,
    percentageChange7d: response.market_data
      ?.price_change_percentage_7d_in_currency?.usd as number,
    website: response.links?.homepage?.shift(),
    imageUrl: response.image?.large,
  };
};

class CoingeckoCoinRepository implements CoinRepository {
  public coins: Coin[] = [];
  private coinsLastUpdated: Date = new Date(0);

  public getCoins = async () => {
    const coinsAge = differenceInHours(new Date(), this.coinsLastUpdated);
    if (this.coins.length && coinsAge < COINS_LIST_CACHE_HOURS) {
      return this.coins;
    }

    const data = await CoingeckoAPI.fetchList();

    const coins = Coin.fromArray(mapCoinGeckoListResponse(data));
    if (!coins.length) {
      return this.coins;
    }

    for (const coin of coins) {
      const index = this.coins.findIndex((value) => value.id === coin.id);
      if (index !== -1) {
        continue;
      }

      this.coins.push(coin);
    }

    this.coinsLastUpdated = new Date();

    return this.coins;
  };

  public find = async (q: string): Promise<Coin | null> => {
    const coins = await this.getCoins();
    if (!coins.length) {
      return null;
    }

    const query = q.toLowerCase();
    const coin = coins.find(
      (value) =>
        value.symbol.toLowerCase() === query ||
        value.id.toLowerCase() === query ||
        value.name.toLowerCase() === query,
    );
    if (!coin) {
      return null;
    }

    const index = this.coins.findIndex((value) => value.id === coin.id);
    await this.enrichCoinByIndex(index);

    return this.coins[index];
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

    const index = this.coins.findIndex((value) => value.id === coin.id);
    await this.enrichCoinByIndex(index);

    return this.coins[index];
  };

  private enrichCoinByIndex = async (index: number) => {
    const coin = this.coins[index];

    try {
      const data = await CoingeckoAPI.fetchById(coin.id);
      if (data) {
        this.coins[index] = new Coin(mapCoinGeckoCoin(data));
      }
    } catch {
      console.error(
        `Could not enrich data for coin ${coin.name} (${coin.symbol})`,
      );
    }
  };
}

export default new CoingeckoCoinRepository();
