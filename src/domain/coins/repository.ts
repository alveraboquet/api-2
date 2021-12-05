import { Coin } from './index';

export interface CoinRepository {
  getCoins(): Promise<Coin[]>;
  find(q: string): Promise<Coin | null>;
}
