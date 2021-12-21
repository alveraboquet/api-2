import fetch from 'node-fetch';

export type ExchangeFlowDataEntry = {
  url_id: string;
  current_balance: number;
  d1_balance: number;
  d7_balance: number;
  d30_balance: number;
};

type ExchangeFlowData = Array<ExchangeFlowDataEntry>;

const getExchangeFlows = async (): Promise<ExchangeFlowData | null> => {
  try {
    const response = await fetch('https://api.viewbase.com/exchange');

    return response.json();
  } catch {
    return null;
  }
};

const ViewBaseAPI = {
  getExchangeFlows,
};

export default ViewBaseAPI;
