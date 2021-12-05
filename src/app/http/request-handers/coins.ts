import CoingeckoCoinsRepository from 'app/coins/coingecko-repository';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const coins = await CoingeckoCoinsRepository.getCoins();
  if (coins.length === 0) {
    return res.status(404).json({
      success: false,
      meta: {},
      data: [],
    });
  }

  const filter = req.query.filter as string;
  const meta: { filter?: string } = {};
  if (filter) {
    meta.filter = filter;
  }

  let data = coins.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
  }));
  if (filter) {
    data = data.filter(
      (coin) =>
        coin.symbol === filter || coin.name === filter || coin.id === filter,
    );
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.status(200).json({
    success: true,
    meta,
    data,
  });
};
