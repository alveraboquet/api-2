import { Request, Response } from 'express';

export default (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=30');
  res
    .status(200)
    .json([
      [
        '/candles/btc:usd',
        '/candles/eth:usdt',
        '/candles/bnb:busd?exchange=binance',
        '/candles/mana:usdc?exchange=coinbase',
        '/candles/kcs:usdt?exchange=kucoin',
      ],
    ]);
};
