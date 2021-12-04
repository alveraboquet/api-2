import { Exchange } from 'domain/exchanges';
import { Request, Response } from 'express';

const SUPPORTED_EXCHANGES = [Exchange.Binance, Exchange.FTX];

export default (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=30');
  res.status(200).json([
    {
      route: '/candles/:pair',
      params: {
        pair: {
          type: 'string',
          required: true,
        },
        exchange: {
          type: 'string',
          required: false,
          default: 'ftx',
          values: SUPPORTED_EXCHANGES,
        },
      },
      examples: [
        '/candles/btc:usd',
        '/candles/eth:usdt',
        '/candles/bnb:busd?exchange=binance',
        '/candles/ltc:usdc?exchange=binance',
      ],
      note: 'Only USD pairs are supported.',
    },
  ]);
};
