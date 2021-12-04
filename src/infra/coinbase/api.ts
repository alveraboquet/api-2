import fetch from 'node-fetch';

interface FetchCandlesOptions {
  quote: string;
  base: string;
  startTime: Date;
  endTime: Date;
}

// https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductcandles
// [
//   1630116000, // time
//   48976.99, // low
//   49160.84, // high
//   49160.83, // open
//   49072.23, // close
//   123.30518726 // volume
// ]

export type CoinbaseEntry = Array<number>;
export type CoinbaseResponse = CoinbaseEntry[];

const fetchCandles = async (
  options: FetchCandlesOptions,
): Promise<CoinbaseResponse> => {
  const start = options.startTime.toISOString();
  const end = options.endTime.toISOString();
  const product = `${options.base}-${options.quote}`.toUpperCase();

  try {
    const response = await fetch(
      `https://api.exchange.coinbase.com/products/${product}/candles?granularity=3600&start=${start}&end=${end}`,
    );

    const data = (await response.json()) as CoinbaseResponse;
    if (Array.isArray(data) && data.length) {
      return data;
    }
  } catch (e) {
    console.error(`infra/coinbase/api error:`, e);

    return [];
  }

  return [];
};

const CoinbaseAPI = {
  fetchCandles,
};

export default CoinbaseAPI;
