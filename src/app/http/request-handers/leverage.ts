import { Request, Response } from 'express';
import CoinGlassAPI from 'infra/coinglass/api';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const response = await CoinGlassAPI.fetchStatistics();
  if (!response) {
    return res.status(500).json({
      success: false,
      meta: {},
      data: {},
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=120');
  res.status(200);
  res.json({
    success: true,
    meta: {},
    data: {
      quoteCurrency: 'usd',
      openInterest: response.data.openInterest,
      openInterestChange: response.data.oiH24Chain,
      liquidations24h: response.data.liquidationH24VolUsd,
      liquidations24hChange: response.data.lqH24Chain,
      longRate: response.data.longRate,
      shortRate: response.data.shortRate,
    },
  });
};
