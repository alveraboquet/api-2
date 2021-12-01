import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import handlers from './request-handers';

dotenv.config();

const HOST = process.env.HOST as string;
const PORT = process.env.PORT as unknown as number;

if (!HOST) {
  throw new Error('$HOST is undefined');
}

if (!PORT) {
  throw new Error('$PORT is undefined');
}

const app = express();

app.use(cors());

app.get('/', handlers.root);

app.listen(PORT, HOST, () => {
  console.log(`Started server on http://${HOST}:${PORT} 🚀`);
});
