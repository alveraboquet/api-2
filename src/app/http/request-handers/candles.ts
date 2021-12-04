import FtxRepository from 'app/candles/ftx-repository';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const pair = req.params.pair;
  if (!pair) {
    return res.status(400).json({ success: false, data: [] });
  }

  const [base, quote] = pair.split(':');
  if (!base || !quote) {
    return res.status(400).json({ success: false, data: [] });
  }

  const candles = await FtxRepository.getCandles({ base, quote });

  if (candles.length === 0) {
    return res.status(404).json({
      success: false,
      data: [],
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=30');
  return res.status(200).json({
    success: true,
    data: candles,
  });
};
