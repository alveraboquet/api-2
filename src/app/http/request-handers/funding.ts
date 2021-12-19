import CoingeckoCoinsRepository from 'app/coins/coingecko-repository';
import { Request, Response } from 'express';
import CoinGlassAPI from 'infra/coinglass/api';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const coins = await CoingeckoCoinsRepository.getCoinsTop();
  const response = await CoinGlassAPI.fetchFundingRates();
  if (!response || !coins || !coins?.length) {
    return res.status(500).json({
      success: false,
      meta: {},
      data: {},
    });
  }

  const data: Record<string, Array<{ exchange: string; rate: number }>> = {};
  for (const entry of response.data) {
    const coin = coins.find(
      (coin) => coin.symbol.toLowerCase() === entry.symbol.toLowerCase(),
    );
    if (!coin) {
      continue;
    }

    data[coin.id] = entry.uMarginList.map((item) => ({
      exchange: item.exchangeName,
      rate: item.rate,
    }));
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200);
  res.json({
    success: true,
    meta: {},
    data,
  });
};
