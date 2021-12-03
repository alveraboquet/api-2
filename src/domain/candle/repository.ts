import { Candle } from './index';

export interface GetCandlesOptions {
  quote: string;
  base: string;
  interval: 15 | 60 | 240 | 1440;
}

export interface CandleRepository {
  getCandles(options: GetCandlesOptions): Promise<Candle[]>;
}
