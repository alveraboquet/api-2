import { fromUnixTime, subDays, subHours, subMinutes } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import CoinbaseAPI, {
  CoinbaseEntry,
  CoinbaseResponse,
} from 'infra/coinbase/api';

export const mapCoinbaseEntry = (entry: CoinbaseEntry) => {
  return {
    timestamp: fromUnixTime(entry[0]),
    open: entry[3] as number,
    high: entry[2] as number,
    low: entry[1] as number,
    close: entry[4] as number,
  };
};

export const mapCoinbaseResponse = (response: CoinbaseResponse) => {
  return response.reverse().map(mapCoinbaseEntry);
};

class CoinbaseCandleRepository implements CandleRepository {
  getCandles = async ({
    base,
    quote,
    limit,
    resolution,
  }: GetCandlesOptions) => {
    const endTime = new Date();
    let startTime = new Date();
    if (resolution === 900) {
      startTime = subMinutes(endTime, limit * 15);
    } else if (resolution === 3600) {
      startTime = subHours(endTime, limit);
    } else if (resolution === 14400) {
      startTime = subHours(endTime, limit * 4);
    } else if (resolution === 21600) {
      startTime = subHours(endTime, limit * 6);
    } else if (resolution === 86400) {
      startTime = subDays(endTime, limit);
    }

    const data = await CoinbaseAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
      resolution,
    });

    return Candle.fromArray(mapCoinbaseResponse(data));
  };
}

export default new CoinbaseCandleRepository();
