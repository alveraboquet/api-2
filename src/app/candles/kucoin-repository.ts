import { subHours } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import KucoinAPI from 'infra/kucoin/api';
import { mapKucoinResponse } from 'infra/kucoin/mapper';

class KucoinCandleRepository implements CandleRepository {
  getCandles = async ({ base, quote }: GetCandlesOptions) => {
    const endTime = new Date();
    const startTime = subHours(endTime, 48);

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
