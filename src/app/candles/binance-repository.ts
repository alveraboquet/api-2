import { subDays, subHours, subMinutes } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import BinanceAPI, { BinanceEntry, BinanceResponse } from 'infra/binance/api';

export const mapBinanceEntry = (entry: BinanceEntry) => {
  return {
    timestamp: new Date(entry[0] as number),
    open: parseFloat(entry[1] as string),
    high: parseFloat(entry[2] as string),
    low: parseFloat(entry[3] as string),
    close: parseFloat(entry[4] as string),
  };
};

export const mapBinanceResponse = (response: BinanceResponse) => {
  return response.map(mapBinanceEntry);
};

class BinanceCandleRepository implements CandleRepository {
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

    const data = await BinanceAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
      resolution,
    });

    return Candle.fromArray(mapBinanceResponse(data));
  };
}

export default new BinanceCandleRepository();
