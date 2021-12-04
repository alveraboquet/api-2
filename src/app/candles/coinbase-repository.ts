import { fromUnixTime, subHours } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import CoinbaseAPI, {
  CoinbaseEntry,
  CoinbaseResponse,
} from 'infra/coinbase/api';

export const mapCoinbaseEntry = (entry: CoinbaseEntry) => {
  return {
    timestamp: fromUnixTime(entry[0]),
    open: entry[1] as number,
    high: entry[2] as number,
    low: entry[3] as number,
    close: entry[4] as number,
  };
};

export const mapCoinbaseResponse = (response: CoinbaseResponse) => {
  return response.reverse().map(mapCoinbaseEntry);
};

class CoinbaseCandleRepository implements CandleRepository {
  getCandles = async ({ base, quote }: GetCandlesOptions) => {
    const endTime = new Date();
    const startTime = subHours(endTime, 48);

    const data = await CoinbaseAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
    });

    return Candle.fromArray(mapCoinbaseResponse(data));
  };
}

export default new CoinbaseCandleRepository();
