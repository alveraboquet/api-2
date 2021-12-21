import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import handlers from './request-handers';

const HOST = process.env.HOST as string;
const PORT = process.env.PORT as unknown as number;

if (!HOST) {
  throw new Error('$HOST is undefined');
}

if (!PORT) {
  throw new Error('$PORT is undefined');
}

const app = express();

app.use(morgan('short'));
app.use(cors());

app.get('/', handlers.root);
app.get('/candles/:pair', handlers.candles);
app.get('/coins', handlers.coins);
app.get('/coins/top', handlers.coinsTop);
app.get('/coins/:q', handlers.coin);
app.get('/coins/:id/image.png', handlers.coinImage);
app.get('/chart/:pair.jpg', handlers.chart);
app.get('/exchange-flows/:coin', handlers.exchangeFlows);
app.get('/leverage', handlers.leverage);
app.get('/funding', handlers.funding);
app.get('/funding/:id', handlers.fundingCoin);
app.get('/tradfi', handlers.tradfi);

app.listen(PORT, HOST, () => {
  console.log(`Started server on http://${HOST}:${PORT} 🚀`);
});
