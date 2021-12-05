import fetch from 'node-fetch';

export type CoinGeckoListEntry = {
  id: string;
  symbol: string;
  name: string;
};

export type CoinGeckoListResponse = CoinGeckoListEntry[];

const fetchList = async (): Promise<CoinGeckoListResponse> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    const json = await response.json();

    if (Array.isArray(json)) {
      return json;
    }
  } catch (e) {
    return [];
  }

  return [];
};

const CoinGeckoAPI = {
  fetchList,
};

export default CoinGeckoAPI;
