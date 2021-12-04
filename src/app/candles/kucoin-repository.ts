import { fromUnixTime, subDays, subHours, subMinutes } from 'date-fns';
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

    const data = await KucoinAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
      resolution,
    });

    return Candle.fromArray(mapKucoinResponse(data));
  };
}

export default new KucoinCandleRepository();
