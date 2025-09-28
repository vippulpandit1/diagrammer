// A connection between two ports
export class Connection {
  public id?: string = crypto.randomUUID(); // Unique ID for each connection
  public fromGlyphId: string;
  public fromPortId: string;
  public toGlyphId: string;
  public toPortId: string;
  public label?: string = ""; // Optional label for the connection
  public type: "association" | "inheritance" | "default" = "default";

  constructor(
    id: string = crypto.randomUUID(),
    fromGlyphId: string,
    fromPortId: string,
    toGlyphId: string,
    toPortId: string,
    label: string = "",
    type: "association" | "inheritance" | "default" = "default"
  ) {
    this.id = id;
    this.fromGlyphId = fromGlyphId;
    this.fromPortId = fromPortId;
    this.toGlyphId = toGlyphId;
    this.toPortId = toPortId;
    this.type = type;
    this.label = label;
  }

  static fromJSON(obj: any): Connection {
    return new Connection(obj.id, obj.fromGlyphId, obj.fromPortId, obj.toGlyphId, obj.toPortId, obj.type || "default", obj.label || "");
  }
}