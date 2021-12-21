import fetch from 'node-fetch';

export type TwelveDataResponse = Record<
  string,
  {
    symbol: string;
    name: string;
    exchange: string;
    close: string;
    percent_change: string;
  }
>;

export const fetchTradfiIndexes =
  async (): Promise<TwelveDataResponse | null> => {
    try {
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=NDX,SPX,DJI&apikey=${process.env.TWELVEDATA_API_KEY}`,
      );
      return response.json();
    } catch {
      return null;
    }
  };

const CoinGlassAPI = {
  fetchTradfiIndexes,
};

export default CoinGlassAPI;
