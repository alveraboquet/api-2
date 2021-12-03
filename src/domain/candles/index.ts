interface Data {
  timestamp: Date;
  open: number;
  close: number;
  high: number;
  low: number;
}

export class Candle {
  public timestamp: Date;
  public open: number;
  public close: number;
  public high: number;
  public low: number;

  constructor(options: Data) {
    this.timestamp = options.timestamp;
    this.open = options.open;
    this.close = options.close;
    this.high = options.high;
    this.low = options.low;
  }

  public static fromArray = (data: Data[]): Candle[] => {
    return data.map((entry) => new Candle(entry));
  };
}
