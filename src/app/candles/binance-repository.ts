import { subHours } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import BinanceAPI from 'infra/binance/api';
import { mapBinanceResponse } from 'infra/binance/mapper';

class BinanceCandleRepository implements CandleRepository {
  getCandles = async ({ base, quote }: GetCandlesOptions) => {
    const endTime = new Date();
    const startTime = subHours(endTime, 48);

    const data = await BinanceAPI.fetchCandles({
      base,
      quote,
      endTime,
      startTime,
    });

    return Candle.fromArray(mapBinanceResponse(data));
  };
}

export default new BinanceCandleRepository();
