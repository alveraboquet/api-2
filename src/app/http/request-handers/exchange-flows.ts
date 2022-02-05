import { Request, Response } from 'express';
import ViewBaseAPI, { ExchangeFlowDataEntry } from 'infra/viewbase/api';

const mapExchangeFlowEntry = (entry: ExchangeFlowDataEntry) => {
  const id = entry.url_id;
  const balance = Math.round(entry.current_balance);
  const balance24hAgo = Math.round(entry.d1_balance);
  const balance7dAgo = Math.round(entry.d7_balance);
  const balance30dAgo = Math.round(entry.d30_balance);
  const diff24h = balance - balance24hAgo;
  const diff7d = balance - balance7dAgo;
  const diff30d = balance - balance30dAgo;
  const percentageChange24h = (diff24h / balance) * 100;
  const percentageChange7d = (diff7d / balance) * 100;
  const percentageChange30d = (diff30d / balance) * 100;

  return {
    id,
    balance,
    balance24hAgo,
    diff24h,
    percentageChange24h,
    diff7d,
    balance7dAgo,
    percentageChange7d,
    diff30d,
    balance30dAgo,
    percentageChange30d,
  };
};

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  if (req.params.coin && req.params.coin !== req.params.coin?.toLowerCase()) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  const exchangeFlows = await ViewBaseAPI.getExchangeFlows();
  if (!exchangeFlows) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: null,
    });
  }

  if (req.params.coin) {
    const data = exchangeFlows.find(
      (entry) => entry.url_id === req.params.coin,
    );
    if (data) {
      res.setHeader('Cache-Control', 'public, max-age=120');
      return res.status(200).json({
        success: true,
        meta: {
          coin: req.params.coin,
        },
        data: mapExchangeFlowEntry(data),
      });
    }

    return res.status(404).json({
      success: true,
      meta: {},
      data: null,
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=120');
  return res.status(200).json({
    success: true,
    meta: {},
    data: exchangeFlows.map(mapExchangeFlowEntry),
  });
};
