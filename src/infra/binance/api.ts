import fetch from 'node-fetch';

interface FetchCandlesOptions {
  quote: string;
  base: string;
  startTime: Date;
  endTime: Date;
  resolution: number;
}

// https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
// [
//   1499040000000,      // Open time
//   "0.01634790",       // Open
//   "0.80000000",       // High
//   "0.01575800",       // Low
//   "0.01577100",       // Close
//   "148976.11427815",  // Volume
//   1499644799999,      // Close time
//   "2434.19055334",    // Quote asset volume
//   308,                // Number of trades
//   "1756.87402397",    // Taker buy base asset volume
//   "28.46694368",      // Taker buy quote asset volume
//   "17928899.62484339" // Ignore.
// ]

export type BinanceEntry = Array<string | number>;
export type BinanceResponse = BinanceEntry[];

const resolutionMap: Record<number, string> = {
  [900]: '15m',
  [3600]: '1h',
  [14400]: '4h',
  [21600]: '6h',
  [86400]: '1d',
};

const fetchCandles = async (
  options: FetchCandlesOptions,
): Promise<BinanceResponse> => {
  const interval = resolutionMap[options.resolution];
  const startTime = options.startTime.getTime();
  const endTime = options.endTime.getTime();
  const symbol = `${options.base}${options.quote}`.toUpperCase();

  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`,
    );

    const json = (await response.json()) as BinanceResponse;
    if (Array.isArray(json)) {
      return json;
    }
  } catch (e) {
    console.error(`infra/binance/api error:`, e);

    return [];
  }

  return [];
};

const BinanceAPI = {
  fetchCandles,
};

export default BinanceAPI;
