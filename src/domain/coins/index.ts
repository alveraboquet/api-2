interface Data {
  id: string;
  symbol: string;
  name: string;
}

export class Coin {
  public id: string;
  public symbol: string;
  public name: string;

  constructor(options: Data) {
    this.id = options.id;
    this.symbol = options.symbol;
    this.name = options.name;
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
