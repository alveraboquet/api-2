import { getUnixTime } from 'date-fns';
import fetch from 'node-fetch';

interface FetchCandlesOptions {
  quote: string;
  base: string;
  startTime: Date;
  endTime: Date;
}

// https://docs.kucoin.com/#get-trade-histories
// [
//  "1545904980",             //Start time of the candle cycle
//  "0.058",                  //opening price
//  "0.049",                  //closing price
//  "0.058",                  //highest price
//  "0.049",                  //lowest price
//  "0.018",                  //Transaction volume
//  "0.000945"                //Transaction amount
// ]

export type KucoinEntry = Array<string>;
export type KucoinResponse = { data: KucoinEntry[] };

const fetchCandles = async (
  options: FetchCandlesOptions,
): Promise<KucoinResponse | null> => {
  const startAt = getUnixTime(options.startTime);
  const endAt = getUnixTime(options.endTime);
  const symbol = `${options.base}-${options.quote}`.toUpperCase();

  try {
    const response = await fetch(
      `https://api.kucoin.com/api/v1/market/candles?symbol=${symbol}&type=1hour&startAt=${startAt}&endAt=${endAt}`,
    );

    const json = (await response.json()) as KucoinResponse;
    if (json?.data) {
      return json;
    }
  } catch (e) {
    console.error(`infra/kucoin/api error:`, e);

    return null;
  }

  return null;
};

const KucoinAPI = {
  fetchCandles,
};

export default KucoinAPI;
