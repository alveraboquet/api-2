import { FTXEntry, FTXResponse } from './api';

export const mapFTXEntry = (entry: FTXEntry) => {
  return {
    timestamp: new Date(entry.time),
    open: entry.open,
    high: entry.high,
    low: entry.low,
    close: entry.close,
  };
};

export const mapFTXResponse = (response: FTXResponse) => {
  return response.map(mapFTXEntry);
};
