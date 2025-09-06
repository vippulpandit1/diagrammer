// A connection between two ports
export class Connection {
  public fromGlyphId: string;
  public fromPortId: string;
  public toGlyphId: string;
  public toPortId: string;
  public type: "association" | "inheritance" | "default" = "default";

  constructor(
    fromGlyphId: string,
    fromPortId: string,
    toGlyphId: string,
    toPortId: string,
    type: "association" | "inheritance" | "default" = "default"
  ) {
    this.fromGlyphId = fromGlyphId;
    this.fromPortId = fromPortId;
    this.toGlyphId = toGlyphId;
    this.toPortId = toPortId;
    this.type = type;
  }

  static fromJSON(obj: any): Connection {
    return new Connection(obj.fromGlyphId, obj.fromPortId, obj.toGlyphId, obj.toPortId, obj.type || "default");
  }
}