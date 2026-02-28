# Copilot Instructions for R_js_draw

## Project Overview
React-based diagramming application built with **Vite** and **TypeScript** 5.8. Allows users to create, connect, and customize "Glyphs" (SVG-based components) on a persistent canvas.

## Architecture & Big Picture
- **State Management**: Centralized in [src/App.tsx](src/App.tsx). 
  - Uses `Page` objects to support multiple canvas tabs.
  - History (Undo/Redo) is manually tracked in a `history` stack.
  - State is automatically persisted to `sessionStorage` under the key `canvasData`.
- **Glyph System**: 
  - **Model**: Defined by the `Glyph` class in [src/glyph/Glyph.tsx](src/glyph/Glyph.tsx).
  - **Rendering**: Dispatched via [src/glyph/GlyphRenderer.tsx](src/glyph/GlyphRenderer.tsx) based on `glyph.type`.
  - **Registry**: [src/glyph/type/GlyphRegistry.tsx](src/glyph/type/GlyphRegistry.tsx) maps glyph types to metadata and custom Property Sheet components.
- **Canvas Engine**: [src/GlyphCanvas.tsx](src/GlyphCanvas.tsx) handles SVG rendering, coordinate normalization (Zoom/Pan), and connection line calculations (Bezier/Manhattan/Line).

## Critical Workflows
- **Running locally**: `npm run dev`.
- **Adding a New Glyph Type**:
  1. Create the component in `src/glyph/type/[category]/`.
  2. Implement rendering in `GlyphRenderer.tsx`'s switch-case.
  3. Register metadata/defaults in `src/glyph/type/GlyphRegistry.tsx`.
  4. Add to the relevant category in [src/Stencil.tsx](src/Stencil.tsx).
- **Communication Pattern**: UI updates follow a strict `onUpdate` pattern surfacing changes back to `App.tsx` which updates the global state and history.

## Coding Patterns & Conventions
- **SVG Driven**: Almost all visual elements (except sidebar/panels) are wrapped in `<svg>` tags.
- **Port Management**: Glyphs automatically generate ports based on `this.inputs` and `this.outputs` in the `Glyph` constructor.
- **Coordinate System**: Uses absolute positioning `(x, y)` relative to the page. `GlyphCanvas` handles the mapping for zooming.
- **Property Sheets**: Use [src/PropertySheet.tsx](src/PropertySheet.tsx) for generic properties. Custom glyph data should be stored in the `glyph.data` record.

## Integration Points
- **External Dependencies**: `react` 19, `uuid` for IDs, `use-mcp` for Model Context Protocol.
- **Persistence**: Managed through `JSON.stringify` logic in [App.tsx](src/App.tsx#L391).

## Key Files
- [src/App.tsx](src/App.tsx): Main application container and state hub.
- [src/GlyphCanvas.tsx](src/GlyphCanvas.tsx): Core rendering engine (1000+ lines).
- [src/glyph/Glyph.tsx](src/glyph/Glyph.tsx): The TypeScript class defining glyph data structure.
- [src/glyph/GlyphRenderer.tsx](src/glyph/GlyphRenderer.tsx): Central UI component for all glyph types.
- [src/Stencil.tsx](src/Stencil.tsx): Palette of draggable glyph types.
