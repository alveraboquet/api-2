import { getUnixTime } from 'date-fns';

interface Data {
  id: string;
  symbol: string;
  name: string;
  rank?: number;
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
  public rank?: number | null;
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
    this.rank = options.rank;
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

  public get pullback(): number | null {
    if (!this.price) {
      return null;
    }

    if (!this.ath) {
      return null;
    }

    if (this.isAtAth) {
      return 0;
    }

    return this.ath - this.price;
  }

  public get pullbackPercentage(): number | null {
    if (!this.price) {
      return null;
    }

    if (!this.ath) {
      return null;
    }

    return Math.ceil((1 - this.price / this.ath) * 10000) / 100;
  }

  public get isAtAth(): boolean {
    if (!this.pullbackPercentage) {
      return false;
    }

    return this.pullbackPercentage <= 1;
  }

  public toJSON = () => {
    const athDate = this.isAtAth ? new Date() : this.athDate;
    const imageUrl = this.imageUrl ? `/coins/${this.id}/image.png` : null;

    return {
      ...this,
      pullbackPercentage: this.isAtAth ? 0 : this.pullbackPercentage,
      pullback: this.pullback,
      athDate: athDate ? getUnixTime(athDate) : null,
      isAtAth: this.isAtAth,
      imageUrl,
    };
  };

  public static fromArray = (data: Data[]): Coin[] => {
    return data.map((entry) => new Coin(entry));
  };
}
