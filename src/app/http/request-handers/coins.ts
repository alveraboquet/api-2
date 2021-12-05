import CoingeckoCoinsRepository from 'app/coins/coingecko-repository';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const coins = await CoingeckoCoinsRepository.getCoins();

  if (coins.length === 0) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: [],
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.status(200).json({
    success: true,
    meta: {},
    data: coins,
  });
};
