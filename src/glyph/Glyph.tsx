import { Port } from "./Port";

// The main glyph class
export class Glyph {
  id: string;
  type: string;
  x: number;
  y: number;
  ports: Port[];
  data: Record<string, any>;
  label: string = '';
  inputs: number = 2; // Number of input ports (for logic gates)
  outputs: number = 1; // Number of output ports (for logic gates)
  attributes?: string[];
  methods?: string[];

  constructor(
    id: string,
    type: string,
    x: number,
    y: number,
    ports: Port[] = [],
    data: Record<string, any> = {},
    label: string = ""

  ) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.ports = ports;
    this.data = data;
    this.label = label;
  }

  static fromJSON(obj: any): Glyph {
    return new Glyph(
      obj.id,
      obj.type,
      obj.x,
      obj.y,
      (obj.ports || []).map(Port.fromJSON),
      obj.data || {},
      obj.label || "" // <-- Deserialize label

    );
  }
}
