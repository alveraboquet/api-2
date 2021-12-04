import { Candle } from './index';

export interface GetCandlesOptions {
  quote: string;
  base: string;
  limit: number;
}

export interface CandleRepository {
  getCandles(options: GetCandlesOptions): Promise<Candle[]>;
}
