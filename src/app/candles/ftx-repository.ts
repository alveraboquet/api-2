import { subHours } from 'date-fns';
import { Candle } from 'domain/candles';
import { CandleRepository, GetCandlesOptions } from 'domain/candles/repository';
import FTXAPI from 'infra/ftx/api';
import { mapFTXResponse } from 'infra/ftx/mapper';

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
