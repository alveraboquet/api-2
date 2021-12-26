import { Request, Response } from 'express';
import BloombergAPI from 'infra/bloomberg/api';

const mapIdToSymbol = (id: string) => {
  switch (id) {
    case 'DM1:IND':
      return 'DJI';
    case 'ES1:IND':
      return 'SPX';
    case 'NQ1:IND':
      return 'NDX';
  }

  return null;
};

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const response = await BloombergAPI.fetchUsStockFutures();
  if (!response) {
    return res.status(500).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  const data = response.fieldDataCollection.map((entry) => ({
    symbol: mapIdToSymbol(entry.id),
    percentageChange: entry.percentChange1Day,
    value: entry.price,
  }));

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200);
  res.json({
    success: true,
    meta: {},
    data,
  });
};
