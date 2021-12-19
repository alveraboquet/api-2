import { Request, Response } from 'express';
import CoinGlassAPI from 'infra/coinglass/api';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const response = await CoinGlassAPI.fetchFundingRates();
  if (!response) {
    return res.status(500).json({
      success: false,
      meta: {},
      data: {},
    });
  }

  const data: Record<string, Array<{ exchange: string; rate: number }>> = {};

  for (const entry of response.data.slice(0, 10)) {
    data[entry.symbol] = entry.uMarginList.map((item) => ({
      exchange: item.exchangeName,
      rate: item.rate,
    }));
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200);
  res.json({
    success: true,
    meta: {},
    data,
  });
};
