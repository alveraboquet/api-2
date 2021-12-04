import BinanceRepository from 'app/candles/binance-repository';
import FtxRepository from 'app/candles/ftx-repository';
import { Exchange } from 'domain/exchanges';
import { Request, Response } from 'express';

const SUPPORTED_EXCHANGES = [Exchange.Binance, Exchange.FTX];

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const exchange = (req.query.exchange as Exchange) || Exchange.FTX;
  if (!SUPPORTED_EXCHANGES.includes(exchange)) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  const pair = req.params.pair;
  if (!pair) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  const [base, quote] = pair.split(':');
  if (!base || !quote) {
    return res.status(400).json({ success: false, meta: {}, data: [] });
  }

  let candles = [];
  switch (exchange) {
    case Exchange.FTX:
      candles = await FtxRepository.getCandles({ base, quote });
      break;
    case Exchange.Binance:
      candles = await BinanceRepository.getCandles({ base, quote });
      break;
  }

  if (candles.length === 0) {
    return res.status(404).json({
      success: false,
      meta: { exchange },
      data: [],
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=30');
  return res.status(200).json({
    success: true,
    meta: { exchange },
    data: candles,
  });
};
