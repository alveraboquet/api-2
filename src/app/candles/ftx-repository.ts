import { subHours } from 'date-fns';
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
  getCandles = async ({ base, quote }: GetCandlesOptions) => {
    const endTime = new Date();
    const startTime = subHours(endTime, 48);

    const data = await FTXAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
    });

    return Candle.fromArray(mapFTXResponse(data));
  };
}

export default new FTXCandleRepository();
