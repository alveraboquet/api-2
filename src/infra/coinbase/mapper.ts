import { fromUnixTime } from 'date-fns';

import { CoinbaseEntry, CoinbaseResponse } from './api';

export const mapCoinbaseEntry = (entry: CoinbaseEntry) => {
  return {
    timestamp: fromUnixTime(entry[0]),
    open: entry[1] as number,
    high: entry[2] as number,
    low: entry[3] as number,
    close: entry[4] as number,
  };
};

export const mapCoinbaseResponse = (response: CoinbaseResponse) => {
  return response.reverse().map(mapCoinbaseEntry);
};
