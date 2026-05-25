# PropertySheet Component

**File**: [`src/PropertySheet.tsx`](../src/PropertySheet.tsx)  
**Author**: Vippul Pandit  
**Type**: React Functional Component (`React.FC<PropertySheetProps>`)

---

## Overview

`PropertySheet` is a fixed right-side panel (300 px wide, full height) that displays and edits properties for the currently selected element on the canvas — either a **Glyph** (shape) or a **Connection** (line between shapes).

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `glyph` | `Glyph` | No | The currently selected glyph to inspect |
| `connection` | `Connection` | No | The currently selected connection to inspect |
| `onClose` | `() => void` | Yes | Called when the panel is closed |
| `onUpdateGlyph` | `(id, updates) => void` | No | Callback to push glyph changes to global state |
| `onUpdateConnection` | `(id, updates) => void` | No | Callback to push connection changes to global state |
| `pages` | `Page[]` | No | All pages; used for the off-page connector dropdown |
| `connections` | `Connection[]` | No | All connections; checked before removing ports |

---

## Internal State

| State | Type | Purpose |
|---|---|---|
| `activeTab` | `"General" \| "Attributes" \| "Methods"` | Active tab (UML-class only) |
| `label` | `string` | Display label of the selected element |
| `inputs` / `outputs` | `number` | Port count for the glyph |
| `fontSize` | `number` | Glyph label font size (default `18`) |
| `fontFamily` | `string` | Glyph label font family (default `"Arial"`) |
| `attributes` | `UMLAttr[]` | UML class attributes |
| `methods` | `UMLMethod[]` | UML class methods |
| `connectorType` | `"bezier" \| "manhattan" \| "line"` | Connection routing style |
| `connectionColor` | `string` | Connection stroke color |
| `connectionThickness` | `number` | Connection stroke width (default `2`) |
| `connectionDashed` | `boolean` | Connection dash style |
| `targetPageId` | `string` | Target page for `flow-off-page-connector` glyphs |

All state is re-synced from props whenever the selected `glyph` or `connection` changes via a `useEffect`.

---

## Render Modes

### 1. Nothing selected
Renders an empty-state message: *"Click on a shape or a line to see its properties."*

### 2. Connection selected
Shows **renderConnectionProperties()** with:
- Label input
- Connector type select (`bezier`, `manhattan`, `line`)
- Color picker
- Thickness number input
- Dashed checkbox

### 3. Glyph selected — generic
Shows **renderGeneralTab()** with:
- Label input with inline clear (×) button and Left / Center / Right alignment buttons
- Font family dropdown (9 options: Arial, Helvetica, Times New Roman, …)
- Font size number input (range 6–96)
- Inputs / Outputs number inputs (with port-removal safety warning)
- *Connects to Page* dropdown (only for `flow-off-page-connector` type)

### 4. Glyph selected — `uml-class`
Shows a **3-tab layout** (pill-style tabs):

| Tab | Contents |
|---|---|
| **General** | Same as generic glyph (label, font, ports) |
| **Attributes** | List of `UMLAttr` rows (visibility `+/-/#`, name, data type, remove); *Add Attribute* button |
| **Methods** | List of `UMLMethod` rows (visibility, name, return type); per-method parameter list with *Add Parameter*; *Add Method* button |

### 5. Custom glyph properties
If `glyphRegistry[glyph.type].propertiesComponent` is defined, it is rendered below the standard tabs as an injected React component, receiving `{ glyph, onUpdate }`.

---

## Save / Apply Flow

`handleSave()` is triggered by the **Apply** button:

1. Merges `label`, `inputs`, `outputs`, `fontSize`, `fontFamily`, `labelAlign`, `textColor` into `glyph.updates`.
2. Checks whether reducing port counts would break existing connections — if so, shows a browser `alert` with the connection count and aborts the change.
3. Rebuilds the port array using `Port` instances (preserving existing port IDs to avoid breaking live connections).
4. For connections, calls `onUpdateConnection` with the updated `label`, `connectorType`, `color`, `thickness`, and `dashed` values.
5. Calls `onClose()` to close the panel.

---

## CSS Classes

| Class | Where | Purpose |
|---|---|---|
| `.property-sheet` | Root div | Fixed panel, flex-column container |
| `.property-sheet-header` | Header bar | Glyph type title + close button |
| `.property-sheet-content` | Scrollable area | Holds all form fields |
| `.property-sheet-footer` | Footer bar | Contains the Apply button |
| `.close-btn` | × button | Compact 28 × 28 close icon, red on hover |
| `.save-btn` | Apply button | Full-width blue gradient button |
| `.ps-tab-bar` | Tab container | Pill-style tab row (UML class only) |
| `.ps-tab` | Each tab button | Muted inactive state |
| `.ps-tab-active` | Active tab | White card with blue text |

See [`src/App.css`](../src/App.css) for full rule definitions.

---

## Dependencies

| Import | Source |
|---|---|
| `Glyph` | `./glyph/Glyph` |
| `Connection` | `./glyph/Connection` |
| `Page` | `./glyph/Page` |
| `Port` | `./glyph/Port` |
| `UMLAttr`, `UMLVisibility`, `UMLDataType` | `./glyph/type/uml/UMLAttr` |
| `UMLMethod` | `./glyph/type/uml/UMLMethod` |
| `glyphRegistry` | `./glyph/type/GlyphRegistry` |
| `uuidv4` | `uuid` |

---

## Extension Points

- **Custom property panels**: Register a `propertiesComponent` in [`src/glyph/type/GlyphRegistry.tsx`](../src/glyph/type/GlyphRegistry.tsx) for any glyph type to inject extra UI below the standard form.
- **New glyph-type-specific sections**: Add conditional blocks inside `renderGeneralTab()` keyed on `glyph.type` (see the existing `flow-off-page-connector` example).
- **New connection fields**: Add state + UI inside `renderConnectionProperties()` and include the value in the `handleSave` → `onUpdateConnection` call.
