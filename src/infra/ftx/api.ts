import { getUnixTime } from 'date-fns';
import fetch from 'node-fetch';

interface FetchCandlesOptions {
  quote: string;
  base: string;
  startTime: Date;
  endTime: Date;
  resolution: number;
}

export type FTXEntry = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type FTXResponse = {
  success: boolean;
  result: FTXEntry[];
};

const fetchCandles = async (
  options: FetchCandlesOptions,
): Promise<FTXResponse | null> => {
  const resolution = options.resolution;
  const startTime = getUnixTime(options.startTime);
  const endTime = getUnixTime(options.endTime);
  const pair = `${options.base}/${options.quote}`.toLowerCase();

  try {
    const response = await fetch(
      `https://ftx.com/api/markets/${pair}/candles?resolution=${resolution}&start_time=${startTime}&end_time=${endTime}`,
    );

    const json = (await response.json()) as FTXResponse;
    if (json.success) {
      return json;
    }
  } catch (e) {
    console.error(`infra/ftx/api error:`, e);

    return null;
  }

  return null;
};

const FTXAPI = {
  fetchCandles,
};

export default FTXAPI;
