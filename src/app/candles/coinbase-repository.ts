import { subHours } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import CoinbaseAPI from 'infra/coinbase/api';
import { mapCoinbaseResponse } from 'infra/coinbase/mapper';

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
