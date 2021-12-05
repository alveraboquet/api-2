interface Data {
  id: string;
  symbol: string;
  name: string;
  imageUrl?: string;
  website?: string;
}

export class Coin {
  public id: string;
  public symbol: string;
  public name: string;
  public imageUrl?: string | null;
  public website?: string | null;

  constructor(options: Data) {
    this.id = options.id;
    this.symbol = options.symbol;
    this.name = options.name;
    this.imageUrl = options.imageUrl || null;
    this.website = options.website || null;
  }

  public toJSON = () => {
    return {
      ...this,
    };
  };

  public static fromArray = (data: Data[]): Coin[] => {
    return data.map((entry) => new Coin(entry));
  };
}
