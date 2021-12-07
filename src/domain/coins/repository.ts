import { Coin } from './index';

export interface CoinRepository {
  coins: Coin[];
  getCoins(): Promise<Coin[]>;
  getCoinsTop(): Promise<Coin[]>;
  find(q: string): Promise<Coin | null>;
  findById(id: string): Promise<Coin | null>;
}
