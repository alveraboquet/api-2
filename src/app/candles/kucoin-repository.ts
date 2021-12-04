import { fromUnixTime, subHours } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import KucoinAPI, { KucoinEntry, KucoinResponse } from 'infra/kucoin/api';

export const mapKucoinEntry = (entry: KucoinEntry) => {
  return {
    timestamp: fromUnixTime(parseInt(entry[0] as string)),
    open: parseFloat(entry[1] as string),
    high: parseFloat(entry[3] as string),
    low: parseFloat(entry[4] as string),
    close: parseFloat(entry[2] as string),
  };
};

export const mapKucoinResponse = (response: KucoinResponse | null) => {
  if (!response?.data) {
    return [];
  }

  return response.data.reverse().map(mapKucoinEntry);
};

class KucoinCandleRepository implements CandleRepository {
  getCandles = async ({ base, quote, limit }: GetCandlesOptions) => {
    const endTime = new Date();
    const startTime = subHours(endTime, limit);

    const data = await KucoinAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
    });

    return Candle.fromArray(mapKucoinResponse(data));
  };
}

export default new KucoinCandleRepository();
