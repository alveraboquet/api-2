import { Candle } from './index';

export interface GetCandlesOptions {
  quote: string;
  base: string;
}

export interface CandleRepository {
  getCandles(options: GetCandlesOptions): Promise<Candle[]>;
}
