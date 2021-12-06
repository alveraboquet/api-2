import cheerio from 'cheerio';
import fetch from 'node-fetch';

type BaseEntry = {
  balance: number;
  change: {
    day: number;
    week: number;
    month: number;
  };
};

interface ExchangeEntry extends BaseEntry {
  exchange: string;
}

type ExchangeFlowData = {
  total: BaseEntry;
  exchanges: ExchangeEntry[];
};

const getExchangeFlows = async (
  coin: string,
): Promise<ExchangeFlowData | null> => {
  const data: ExchangeFlowData = {
    total: {
      balance: 0,
      change: {
        day: 0,
        week: 0,
        month: 0,
      },
    },
    exchanges: [],
  };

  try {
    const response = await fetch(
      `https://www.viewbase.com/coin/${coin.toLowerCase()}`,
    );
    if (response.status !== 200) {
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('#myTable tbody tr').each((row, node) => {
      if (row > 12) {
        return;
      }

      const entry = {
        exchange: '',
        balance: 0,
        change: {
          day: 0,
          week: 0,
          month: 0,
        },
      };

      $(node)
        .find('td')
        .each((col, node) => {
          let value = $(node).text();

          // get rid of whitespace
          value = value.replace(/\n/g, '').trim();

          // coin values if col > 0
          if (col > 0) {
            value = value.replace(/BTC/g, '');
            value = value.replace(/,/g, '');
          }

          // trim whitespace once more
          value = value.trim();

          switch (col) {
            case 0:
              entry.exchange = value;
              break;
            case 1:
              entry.balance = parseFloat(value.replace(' BTC', ''));
              break;
            case 2:
              entry.change.day = parseFloat(value.replace(' BTC', ''));
              break;
            case 3:
              entry.change.week = parseFloat(value.replace(' BTC', ''));
              break;
            case 4:
              entry.change.month = parseFloat(value.replace(' BTC', ''));
              break;
          }
        });

      data.exchanges.push(entry);
    });
  } catch {
    return null;
  }

  if (data.exchanges.length === 0) {
    return null;
  }

  for (const exchange of data.exchanges) {
    data.total.change.day += exchange.change.day;
    data.total.change.week += exchange.change.week;
    data.total.change.month += exchange.change.month;
    data.total.balance += exchange.balance;
  }

  return data;
};

const ViewBaseAPI = {
  getExchangeFlows,
};

export default ViewBaseAPI;
