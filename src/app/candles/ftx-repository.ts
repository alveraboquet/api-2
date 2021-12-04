import { subDays, subHours, subMinutes } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import FTXAPI, { FTXEntry, FTXResponse } from 'infra/ftx/api';

export const mapFTXEntry = (entry: FTXEntry) => {
  return {
    timestamp: new Date(entry.time),
    open: entry.open as number,
    high: entry.high as number,
    low: entry.low as number,
    close: entry.close as number,
  };
};

export const mapFTXResponse = (response: FTXResponse | null) => {
  if (!response?.result) {
    return [];
  }

  return response.result.map(mapFTXEntry);
};

class FTXCandleRepository implements CandleRepository {
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

    const data = await FTXAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
      resolution,
    });

    return Candle.fromArray(mapFTXResponse(data));
  };
}

export default new FTXCandleRepository();
