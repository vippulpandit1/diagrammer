import type { Connection } from "./Connection";
import type { Glyph } from "./Glyph";

export interface Page {
  id: string;
  name: string;
  glyphs: Glyph[];
  connections: Connection[];
}