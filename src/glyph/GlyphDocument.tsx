import { Connection } from "./Connection";
import { Glyph } from "./Glyph";

// The overall workspace/document
export class GlyphDocument {
  public glyphs: Glyph[];
  public connections: Connection[];

  constructor(
    glyphs: Glyph[] = [],
    connections: Connection[] = []
  ) {
    this.glyphs = glyphs;
    this.connections = connections;
  }

  static fromJSON(obj: any): GlyphDocument {
    return new GlyphDocument(
      (obj.glyphs || []).map(Glyph.fromJSON),
      (obj.connections || []).map(Connection.fromJSON)
    );
  }

  toJSON() {
    return {
      glyphs: this.glyphs,
      connections: this.connections
    };
  }
}


export { Connection };
// Serialize
//const doc = new GlyphDocument([new Glyph('g1', 'rect', 100, 100)], []);
//const json = JSON.stringify(doc);

// Deserialize
//const loaded = GlyphDocument.fromJSON(JSON.parse(json));