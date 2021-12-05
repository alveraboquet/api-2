import { Coin } from './index';

export interface CoinRepository {
  getCoins(): Promise<Coin[]>;
}
