// A port on a glyph (for connections)
export class Port {
  public id: string;
  public type: 'input' | 'output';
  public x: number;
  public y: number;

  constructor(
    id: string,
    type: 'input' | 'output',
    x: number,
    y: number
  ) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
  }

  static fromJSON(obj: any): Port {
    return new Port(obj.id, obj.type, obj.x, obj.y);
  }
}