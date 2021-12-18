import { Request, Response } from 'express';
import CoinGlassAPI from 'infra/coinglass/api';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const response = await CoinGlassAPI.fetchStatistics();
  if (!response) {
    return res.sendStatus(500);
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200);
  res.json({
    quoteCurrency: 'usd',
    openInterest: response.data.openInterest,
    liquidations24h: response.data.liquidationH24VolUsd,
    longRate: response.data.longRate,
    shortRate: response.data.shortRate,
  });
};
