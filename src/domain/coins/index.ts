interface Data {
  id: string;
  symbol: string;
  name: string;
  quoteCurrency?: string;
  price?: number;
  ath?: number;
  athDate?: Date;
  marketCap?: number;
  percentageChange24h?: number;
  percentageChange7d?: number;
  imageUrl?: string;
  website?: string;
}

export class Coin {
  public id: string;
  public symbol: string;
  public name: string;
  public quoteCurrency?: string;
  public price?: number | null;
  public ath?: number | null;
  public athDate?: Date | null;
  public marketCap?: number | null;
  public percentageChange24h?: number | null;
  public percentageChange7d?: number | null;
  public imageUrl?: string | null;
  public website?: string | null;

  constructor(options: Data) {
    this.id = options.id;
    this.symbol = options.symbol;
    this.name = options.name;
    this.quoteCurrency = options.quoteCurrency;
    this.price = options.price || null;
    this.ath = options.ath || null;
    this.athDate = options.athDate || null;
    this.marketCap = options.marketCap || null;
    this.percentageChange24h = options.percentageChange24h || null;
    this.percentageChange7d = options.percentageChange7d || null;
    this.imageUrl = options.imageUrl || null;
    this.website = options.website || null;
  }

  public toJSON = () => {
    return {
      ...this,
      imageUrl: this.imageUrl ? `/coins/${this.id}/image.png` : null,
    };
  };

  public static fromArray = (data: Data[]): Coin[] => {
    return data.map((entry) => new Coin(entry));
  };
}
