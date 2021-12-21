import { Request, Response } from 'express';
import ViewBaseAPI, { ExchangeFlowDataEntry } from 'infra/viewbase/api';

const mapExchangeFlowEntry = (entry: ExchangeFlowDataEntry) => {
  const id = entry.url_id;
  const balance = entry.current_balance;
  const balance24hAgo = entry.d1_balance;
  const balance7dAgo = entry.d7_balance;
  const balance30dAgo = entry.d30_balance;
  const percentageChange24h = ((balance - balance24hAgo) / balance) * 100;
  const percentageChange7d = ((balance - balance7dAgo) / balance) * 100;
  const percentageChange30d = ((balance - balance30dAgo) / balance) * 100;

  return {
    id,
    balance,
    balance24hAgo,
    percentageChange24h,
    balance7dAgo,
    percentageChange7d,
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
      res.setHeader('Cache-Control', 'public, max-age=60');
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

  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.status(200).json({
    success: true,
    meta: {},
    data: exchangeFlows.map(mapExchangeFlowEntry),
  });
};
