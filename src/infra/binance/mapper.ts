import { BinanceEntry, BinanceResponse } from './api';

export const mapBinanceEntry = (entry: BinanceEntry) => {
  return {
    timestamp: new Date(entry[0] as number),
    open: parseFloat(entry[1] as string),
    high: parseFloat(entry[2] as string),
    low: parseFloat(entry[3] as string),
    close: parseFloat(entry[4] as string),
  };
};

export const mapBinanceResponse = (response: BinanceResponse) => {
  return response.map(mapBinanceEntry);
};
