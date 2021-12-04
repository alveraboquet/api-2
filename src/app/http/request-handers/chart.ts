import CandlestickChart from 'app/candles/chart-lib';
import CoinbaseRepository from 'app/candles/coinbase-repository';
import { createCanvas } from 'canvas';
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
    limit: 72,
    resolution: 3600,
  });

  if (candles.length === 0) {
    return res.sendStatus(404);
  }

  const canvas = createCanvas(1280, 720);
  const chart = new CandlestickChart(canvas, {
    title: `Coinbase ${`${base}/${quote}`.toUpperCase()} 1H`,
  });
  for (const candle of candles) {
    chart.addCandlestick(candle);
  }
  chart.draw();

  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
  res.status(200);
  canvas.createJPEGStream({ quality: 1, chromaSubsampling: false }).pipe(res);
};
