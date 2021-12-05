import CoingeckoCoinsRepository from 'app/coins/coingecko-repository';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

export default async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  const coin = await CoingeckoCoinsRepository.findById(req.params.id);
  if (!coin?.imageUrl) {
    return res.sendStatus(404);
  }

  const response = await fetch(coin.imageUrl);

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=2592000');
  res.status(200);
  response.body.pipe(res);
};
