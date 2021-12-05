import { Coin } from './index';

export interface CoinRepository {
  getCoins(): Promise<Coin[]>;
  find(q: string): Promise<Coin | null>;
  findById(id: string): Promise<Coin | null>;
}
