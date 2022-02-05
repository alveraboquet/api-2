import BinanceRepository from 'app/candles/binance-repository';
import CandlestickChart from 'app/candles/chart-lib';
import CoinbaseRepository from 'app/candles/coinbase-repository';
import FTXRepository from 'app/candles/ftx-repository';
import KucoinRepository from 'app/candles/kucoin-repository';
import { createCanvas } from 'canvas';
import { Candle } from 'domain/candles';
import { Request, Response } from 'express';

const repositories = [
  { name: 'Coinbase', repository: CoinbaseRepository },
  { name: 'FTX', repository: FTXRepository },
  { name: 'Binance', repository: BinanceRepository },
  { name: 'Kucoin', repository: KucoinRepository },
];

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

  let exchange = '';
  const candles: Candle[] = [];
  for (const { name, repository } of repositories) {
    candles.push(
      ...(await repository.getCandles({
        base,
        quote,
        limit: 72,
        resolution: 3600,
      })),
    );

    if (candles.length) {
      exchange = name;
      break;
    }
  }

  if (candles.length === 0) {
    return res.sendStatus(404);
  }

  const canvas = createCanvas(1280, 720);
  const chart = new CandlestickChart(canvas, {
    title: `${exchange} ${`${base}/${quote}`.toUpperCase()} 1H`,
  });
  for (const candle of candles) {
    chart.addCandlestick(candle);
  }
  chart.draw();

  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=120');
  res.status(200);
  canvas.createJPEGStream({ quality: 1, chromaSubsampling: false }).pipe(res);
};
