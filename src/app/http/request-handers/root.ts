import { Request, Response } from 'express';

export default (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=30');
  res.status(200).json([
    ['/chart/btc:usd.jpg', '/chart/eth:usd.jpg', '/chart/ltc:usd.jpg'],
    [
      '/coins',
      '/coins/top',
      '/coins?filter=ltc',
      '/coins?filter=gm',
      '/coins/btc',
      '/coins/bitcoin',
      '/coins/eth',
      '/coins/ethereum',
      '/exchange-flows/bitcoin',
      '/exchange-flows/ethereum',
    ],
    [
      '/candles/btc:usd',
      '/candles/eth:usd',
      '/candles/ltc:usd',
      '/candles/eth:usdc?exchange=coinbase',
      '/candles/bnb:busd?exchange=binance',
      '/candles/ftt:usdt?exchange=ftx',
      '/candles/kcs:usdt?exchange=kucoin',
      '/candles/btc:usdt?exchange=coinbase&limit=1',
      '/candles/btc:usdt?exchange=coinbase&limit=2',
      '/candles/btc:usdt?exchange=coinbase&limit=3',
      '/candles/eth:usdt?exchange=ftx&limit=3&resolution=900',
      '/candles/eth:usdt?exchange=ftx&limit=3&resolution=3600',
      '/candles/eth:usdt?exchange=ftx&limit=3&resolution=14400',
      '/candles/eth:usdt?exchange=ftx&limit=3&resolution=86400',
    ],
  ]);
};
