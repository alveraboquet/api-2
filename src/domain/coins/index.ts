interface Data {
  id: string;
  symbol: string;
  name: string;
  priceInUsd?: number;
  percentageChange24h?: number;
  percentageChange7d?: number;
  imageUrl?: string;
  website?: string;
}

export class Coin {
  public id: string;
  public symbol: string;
  public name: string;
  public priceInUsd?: number | null;
  public percentageChange24h?: number | null;
  public percentageChange7d?: number | null;
  public imageUrl?: string | null;
  public website?: string | null;

  constructor(options: Data) {
    this.id = options.id;
    this.symbol = options.symbol;
    this.name = options.name;
    this.priceInUsd = options.priceInUsd || null;
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
