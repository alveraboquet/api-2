import fetch from 'node-fetch';

export type CoinGlassStatisticsResponse = {
  data: {
    liquidationH24VolUsd: number;
    openInterest: number;
    longRate: number;
    shortRate: number;
  };
};

export const fetchStatistics =
  async (): Promise<CoinGlassStatisticsResponse | null> => {
    try {
      const response = await fetch(
        'https://fapi.coinglass.com/api/futures/home/statistics',
      );
      return response.json();
    } catch {
      return null;
    }
  };

export type CoinGlassFundingResponse = {
  data: Array<{
    symbol: string;
    uMarginList: Array<{
      rate: number;
      exchangeName: string;
    }>;
  }>;
};

export const fetchFundingRates =
  async (): Promise<CoinGlassFundingResponse | null> => {
    try {
      const response = await fetch(
        'https://fapi.coinglass.com/api/fundingRate/v2/home',
      );
      return response.json();
    } catch {
      return null;
    }
  };

const CoinGlassAPI = {
  fetchStatistics,
  fetchFundingRates,
};

export default CoinGlassAPI;
