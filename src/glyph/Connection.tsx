// A connection between two ports
export class Connection {
  public id?: string = crypto.randomUUID(); // Unique ID for each connection
  public fromGlyphId: string;
  public fromPortId: string;
  public toGlyphId: string;
  public toPortId: string;
  public label?: string = ""; // Optional label for the connection
  public type: "association" | "inheritance" | "default" = "default";
  // Hashmap for view-specific properties
  public view: { [key: string]: any } = {};
/*
// Set a view property
conn.setViewProperty("dashed", true);

// Get a view property
const color = conn.getViewProperty("color"); // "#2563eb"

// Check if a property exists
if (conn.hasViewProperty("customData")) {
  // Do something
}

// Remove a property
conn.removeViewProperty("thickness");
*/
  constructor(
    id: string = crypto.randomUUID(),
    fromGlyphId: string,
    fromPortId: string,
    toGlyphId: string,
    toPortId: string,
    label: string = "",
    type: "association" | "inheritance" | "default" = "default",
    view?: { [key: string]: any }
  ) {
    this.id = id;
    this.fromGlyphId = fromGlyphId;
    this.fromPortId = fromPortId;
    this.toGlyphId = toGlyphId;
    this.toPortId = toPortId;
    this.type = type;
    this.label = label;
    if (view) {
      this.view = { ...view };
    }
  }

  static fromJSON(obj: any): Connection {
    return new Connection(obj.id, obj.fromGlyphId, obj.fromPortId, obj.toGlyphId, obj.toPortId, obj.type || "default", obj.label || "");
  }
}