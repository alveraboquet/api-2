import BinanceRepository from 'app/candles/binance-repository';
import CoinbaseRepository from 'app/candles/coinbase-repository';
import FtxRepository from 'app/candles/ftx-repository';
import KucoinRepository from 'app/candles/kucoin-repository';
import { Candle } from 'domain/candles';
import { Exchange } from 'domain/exchanges';
import { Request, Response } from 'express';

const SUPPORTED_EXCHANGES = [
  Exchange.Binance,
  Exchange.Coinbase,
  Exchange.FTX,
  Exchange.Kucoin,
];

const SUPPORTED_RESOLUTIONS = [900, 3600, 14400, 21600, 86400];

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const exchange = (req.query.exchange as Exchange) || Exchange.FTX;
  if (!SUPPORTED_EXCHANGES.includes(exchange)) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  const limit = parseInt(req.query.limit as string) || 48;
  if (!limit || isNaN(limit)) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  const resolution = parseInt(req.query.resolution as string) || 900;
  if (!SUPPORTED_RESOLUTIONS.includes(resolution)) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  const pair = req.params.pair;
  if (!pair) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  if (pair !== pair.toLowerCase()) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  const [base, quote] = pair.split(':');
  if (!base || !quote) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  const candles: Candle[] = [];
  switch (exchange) {
    case Exchange.Binance:
      candles.push(
        ...(await BinanceRepository.getCandles({
          base,
          quote,
          limit,
          resolution,
        })),
      );
      break;
    case Exchange.Coinbase:
      candles.push(
        ...(await CoinbaseRepository.getCandles({
          base,
          quote,
          limit,
          resolution,
        })),
      );
      break;
    case Exchange.FTX:
      candles.push(
        ...(await FtxRepository.getCandles({
          base,
          quote,
          limit,
          resolution,
        })),
      );
      break;
    case Exchange.Kucoin:
      candles.push(
        ...(await KucoinRepository.getCandles({
          base,
          quote,
          limit,
          resolution,
        })),
      );
      break;
  }

  if (candles.length === 0) {
    return res.status(404).json({
      success: false,
      meta: { exchange, pair: { base, quote }, limit, resolution },
      data: [],
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.status(200).json({
    success: true,
    meta: { exchange, pair: { base, quote }, limit, resolution },
    data: candles,
  });
};
