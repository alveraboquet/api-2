import { fromUnixTime } from 'date-fns';

import { KucoinEntry, KucoinResponse } from './api';

export const mapKucoinEntry = (entry: KucoinEntry) => {
  return {
    timestamp: fromUnixTime(parseInt(entry[0] as string)),
    open: parseFloat(entry[1] as string),
    high: parseFloat(entry[3] as string),
    low: parseFloat(entry[4] as string),
    close: parseFloat(entry[2] as string),
  };
};

export const mapKucoinResponse = (response: KucoinResponse | null) => {
  if (!response?.data) {
    return [];
  }

  return response.data.map(mapKucoinEntry);
};
