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
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
          },
        },
      );

      try {
        const json = await response.json();

        return json;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  };

const BloombergAPI = {
  fetchUsStockFutures,
};

export default BloombergAPI;
