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
    priceInUsd: response?.market_data?.current_price?.usd as number,
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

  getCoins = async () => {
    const coinsAge = differenceInHours(new Date(), this.coinsLastUpdated);
    if (this.coins.length && coinsAge < COINS_LIST_CACHE_HOURS) {
      console.info(
        `Found ${this.coins.length} coins in cache, still valid for ${
          COINS_LIST_CACHE_HOURS - coinsAge
        } hours`,
      );
      return this.coins;
    }

    const data = await CoingeckoAPI.fetchList();

    const coins = Coin.fromArray(mapCoinGeckoListResponse(data));
    if (!coins.length) {
      return this.coins;
    }

    let newCoins = 0;
    for (const coin of coins) {
      const index = this.coins.findIndex((value) => value.id === coin.id);
      if (index !== -1) {
        continue;
      }

      this.coins.push(coin);
      newCoins++;
    }

    this.coinsLastUpdated = new Date();

    console.info(`Fetched ${newCoins} new coins`);

    return this.coins;
  };

  find = async (q: string): Promise<Coin | null> => {
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
      console.log(`No coin found for q = ${q}`);
      return null;
    }

    console.log(`Found coin ${coin.name} (${coin.symbol}) for q = ${q}`);

    const data = await CoingeckoAPI.fetchById(coin.id);
    if (data) {
      const index = this.coins.findIndex((value) => value.id === coin.id);
      this.coins[index] = new Coin(mapCoinGeckoCoin(data));

      return this.coins[index];
    }

    return coin;
  };
}

export default new CoingeckoCoinRepository();
