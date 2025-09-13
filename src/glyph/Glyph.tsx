import { Port } from "./Port";
import type { UMLAttr } from "./type/uml/UMLAttr";
import type { UMLMethod } from "./type/uml/UMLMethod";

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
  attributes?: UMLAttr[];
  methods?: UMLMethod[];
  groupId?: string; // Optional group ID for grouping glyphs

  constructor(
    id: string,
    type: string,
    x: number,
    y: number,
    ports: Port[] = [],
    data: Record<string, any> = {},
    label: string = "",
    inputs: number = 2,
    outputs: number = 1,
    attributes: UMLAttr[] = [],
    methods: UMLMethod[] = []

  ) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.ports = ports;
    this.data = data;
    this.label = label;
    this.inputs = inputs;
    this.outputs = outputs;
    this.attributes = attributes;
    this.methods = methods;
  }

  static fromJSON(obj: any): Glyph {
    return new Glyph(
      obj.id,
      obj.type,
      obj.x,
      obj.y,
      (obj.ports || []).map(Port.fromJSON),
      obj.data || {},
      obj.label || "", // <-- Deserialize label
      obj.inputs || 2,
      obj.outputs || 1,
      obj.attributes || [],
      obj.methods || []

    );
  }
}
