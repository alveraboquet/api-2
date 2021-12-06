import { Request, Response } from 'express';
import ViewBaseAPI from 'infra/viewbase/api';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  if (req.params.coin !== req.params.coin.toLowerCase()) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  const exchangeFlows = await ViewBaseAPI.getExchangeFlows(req.params.coin);
  if (!exchangeFlows) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.status(200).json({
    success: true,
    meta: {
      coin: req.params.coin,
    },
    data: exchangeFlows,
  });
};
