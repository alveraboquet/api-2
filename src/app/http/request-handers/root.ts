import { Request, Response } from 'express';

export default (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=30');
  res.status(200).json([
    {
      route: '/candles/:pair',
      examples: ['/candles/btc:usd', '/candles/eth:usdt', '/candles/ltc:usdc'],
    },
  ]);
};
