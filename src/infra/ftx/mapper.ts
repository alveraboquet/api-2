import { FTXEntry, FTXResponse } from './api';

export const mapFTXEntry = (entry: FTXEntry) => {
  return {
    timestamp: new Date(entry.time),
    open: entry.open as number,
    high: entry.high as number,
    low: entry.low as number,
    close: entry.close as number,
  };
};

export const mapFTXResponse = (response: FTXResponse) => {
  return response.map(mapFTXEntry);
};
