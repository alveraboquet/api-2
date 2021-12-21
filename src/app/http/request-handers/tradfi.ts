import { Request, Response } from 'express';
import TwelvedataAPI from 'infra/twelvedata/api';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const response = await TwelvedataAPI.fetchTradfiIndexes();
  if (!response) {
    return res.status(500).json({
      success: false,
      meta: {},
      data: {},
    });
  }

  const data = Object.values(response).map((entry) => ({
    symbol: entry.symbol,
    percentageChange: parseFloat(entry.percent_change),
    value: parseFloat(entry.close),
  }));

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200);
  res.json({
    success: true,
    meta: {},
    data,
  });
};
