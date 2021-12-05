import CoingeckoCoinsRepository from 'app/coins/coingecko-repository';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  if (req.params.q !== req.params.q.toLowerCase()) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  const coin = await CoingeckoCoinsRepository.find(req.params.q);
  if (!coin) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.status(200).json({
    success: true,
    meta: {},
    data: coin,
  });
};
