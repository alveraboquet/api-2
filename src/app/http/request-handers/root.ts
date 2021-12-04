import { Exchange } from 'domain/exchanges';
import { Request, Response } from 'express';

const SUPPORTED_EXCHANGES = [
  Exchange.Binance,
  Exchange.Coinbase,
  Exchange.FTX,
  Exchange.Kucoin,
];

const SUPPORTED_RESOLUTIONS = [900, 3600, 14400, 21600, 86400];

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
        limit: {
          type: 'number',
          required: false,
          default: 48,
        },
        resolution: {
          type: 'number',
          required: false,
          default: 900,
          values: SUPPORTED_RESOLUTIONS,
        },
      },
      examples: [
        '/candles/btc:usd',
        '/candles/eth:usdc?exchange=coinbase',
        '/candles/bnb:busd?exchange=binance&limit=3',
        '/candles/trx:usdt?exchange=kucoin&limit=3&resolution=3600',
      ],
      note: 'Coinbase does not support the 14400 resolution and FTX does not support the 21600 resolution.',
    },
  ]);
};
