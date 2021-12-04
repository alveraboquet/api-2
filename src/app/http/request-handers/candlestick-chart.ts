import CoinbaseRepository from 'app/candles/coinbase-repository';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const pair = req.params.pair;
  if (!pair) {
    return res.sendStatus(400);
  }

  if (pair !== pair.toLowerCase()) {
    return res.sendStatus(400);
  }

  const [base, quote] = pair.split(':');
  if (!base || !quote) {
    return res.sendStatus(400);
  }

  const candles = await CoinbaseRepository.getCandles({
    base,
    quote,
    limit: 48,
    resolution: 3600,
  });

  if (candles.length === 0) {
    return res.sendStatus(404);
  }

  res.setHeader('Cache-Control', 'public, max-age=30');
  return res.status(200).json({
    success: true,
  });
};
