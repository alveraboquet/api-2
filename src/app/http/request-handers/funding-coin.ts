import CoingeckoCoinsRepository from 'app/coins/coingecko-repository';
import { Request, Response } from 'express';
import CoinGlassAPI from 'infra/coinglass/api';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  if (req.params.id !== req.params.id.toLowerCase()) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: [],
    });
  }

  if (!req.params.id) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: [],
    });
  }

  const coins = await CoingeckoCoinsRepository.getCoins();
  const response = await CoinGlassAPI.fetchFundingRates();
  if (!response || !coins || !coins?.length) {
    return res.status(500).json({
      success: false,
      meta: {},
      data: [],
    });
  }

  const id = req.params.id;
  const coin = coins.find((coin) => coin.id === id);
  if (!coin) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: [],
    });
  }

  const funding = response?.data.find(
    ({ symbol }) => symbol.toLowerCase() === coin.symbol.toLowerCase(),
  );
  if (!funding) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: [],
    });
  }

  const data = funding.uMarginList.map((item) => ({
    exchange: item.exchangeName,
    rate: item.rate,
  }));

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.status(200);
  res.json({
    success: true,
    meta: {},
    data,
  });
};
