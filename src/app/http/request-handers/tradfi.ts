import { Request, Response } from 'express';
import BloombergAPI from 'infra/bloomberg/api';
import TwelvedataAPI from 'infra/twelvedata/api';

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

  const bloombergResponse = await BloombergAPI.fetchUsStockFutures();
  if (bloombergResponse) {
    const data = bloombergResponse.fieldDataCollection.map((entry) => ({
      symbol: mapIdToSymbol(entry.id),
      percentageChange: entry.percentChange1Day,
      value: entry.price,
    }));

    res.setHeader('Cache-Control', 'public, max-age=120');
    res.status(200);
    res.json({
      success: true,
      meta: { source: 'bloomberg' },
      data,
    });
    return;
  }

  const twelvedataResponse = await TwelvedataAPI.fetchTradfiIndexes();
  if (!twelvedataResponse) {
    return res.status(500).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  const data = Object.values(twelvedataResponse).map((entry) => ({
    symbol: entry.symbol,
    percentageChange: parseFloat(entry.percent_change),
    value: parseFloat(entry.close),
  }));

  res.setHeader('Cache-Control', 'public, max-age=120');
  res.status(200);
  res.json({
    success: true,
    meta: { source: 'twelvedata' },
    data,
  });
};
