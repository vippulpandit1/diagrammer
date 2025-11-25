export class MCPGlyph implements MCPGlyph {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  data?: Record<string, any>;
  groupId?: string;
  ports?: Array<{
    id: string;
    type: "input" | "output";
  }>;
  attributes?: Array<{
    name: string;
    type: string;
  }>;
  methods?: Array<{
    name: string;
    returnType: string;
  }>;

  constructor({
    id,
    type,
    x,
    y,
    width,
    height,
    label,
    data,
    groupId,
    ports,
    attributes,
    methods,
  }: Partial<MCPGlyph>) {
    this.id = id || crypto.randomUUID();
    this.type = type || "default";
    this.x = x || 0;
    this.y = y || 0;
    this.width = width;
    this.height = height;
    this.label = label || "New Glyph";
    this.data = data || {};
    this.groupId = groupId;
    this.ports = ports || [];
    this.attributes = attributes || [];
    this.methods = methods || [];
  }

  // Update glyph properties
  onUpdate(id: string, updates: Partial<MCPGlyph>) {
    Object.assign(this, updates);
  }

  // Render glyph (can be overridden for custom rendering)
  onRender() {
    return (
      <svg
        key={this.id}
        width={this.width || 100}
        height={this.height || 100}
        style={{
          position: "absolute",
          left: this.x,
          top: this.y,
          border: "1px solid #ccc",
        }}
      >
        <rect
          x={0}
          y={0}
          width={this.width || 100}
          height={this.height || 100}
          fill="#f3f4f6"
          stroke="#2563eb"
        />
        <text
          x={(this.width || 100) / 2}
          y={(this.height || 100) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill="#000"
        >
          {this.label}
        </text>
      </svg>
    );
  }
}