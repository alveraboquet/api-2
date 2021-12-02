interface CandleConstructor {
  timestamp: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

export class Candle {
  public timestamp: number;
  public open: number;
  public close: number;
  public high: number;
  public low: number;

  constructor(options: CandleConstructor) {
    this.timestamp = options.timestamp;
    this.open = options.open;
    this.close = options.close;
    this.high = options.high;
    this.low = options.low;
  }
}
