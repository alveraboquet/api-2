import { differenceInHours } from 'date-fns';
import { Coin } from 'domain/coins';
import { CoinRepository } from 'domain/coins/repository';
import CoingeckoAPI, {
  CoinGeckoListEntry,
  CoinGeckoListResponse,
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
}

export default new CoingeckoCoinRepository();
