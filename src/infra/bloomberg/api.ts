import fetch from 'node-fetch';

export type BloombergResponse = {
  fieldDataCollection: Array<{
    id: string;
    name: string;
    price: number;
    priceChange1Day: number;
    percentChange1Day: number;
    lastUpdateISO: string;
  }>;
};

export const fetchUsStockFutures =
  async (): Promise<BloombergResponse | null> => {
    try {
      const response = await fetch(
        'https://www.bloomberg.com/markets/api/comparison/data?securities=DM1%3AIND,ES1%3AIND,NQ1%3AIND',
      );
      return response.json();
    } catch {
      return null;
    }
  };

const BloombergAPI = {
  fetchUsStockFutures,
};

export default BloombergAPI;
