# R_js_draw

A React-based diagramming application built with **Vite** and **TypeScript** 5.8. Allows users to create, connect, and customize "Glyphs" (SVG-based components) on a persistent canvas.

## Architecture Overview

```mermaid
graph TD
    subgraph UI_Layer [UI Layer]
        App[App.tsx - Central State & History]
        Toolbar[Toolbar.tsx - Category Selection]
        Stencil[Stencil.tsx - Draggable Glyphs]
        HeaderBar[HeaderBar.tsx - Actions & Zoom]
        PropertySheet[PropertySheet.tsx - Editor Panel]
        BottomPanel[BottomPanel.tsx - Logs & Metrics]
    end

    subgraph Canvas_Engine [Canvas Engine]
        GlyphCanvas[GlyphCanvas.tsx - SVG Rendering & Math]
        UnitsOverlay[UnitsOverlay.tsx - Grid & Scale]
    end

    subgraph Glyph_System [Glyph System]
        GlyphClass[Glyph.tsx - Data Model]
        GlyphRenderer[GlyphRenderer.tsx - Component Dispatch]
        GlyphRegistry[GlyphRegistry.tsx - Metadata & Props]
        
        subgraph Glyph_Types [Glyph Types]
            Basic[Basic Glyphs]
            Logic[Logic Gates]
            Flowchart[Flowchart]
            UML[UML Class/Interface]
            Network[Network Icons]
            MCP[MCP Components]
        end
    end

    subgraph Infrastructure
        Persistence[(sessionStorage - canvasData)]
        History[Undo/Redo Stack]
        MCP_Lib[use-mcp / MCP SDK]
    end

    %% Data Flow
    App -->|State| GlyphCanvas
    App -->|Selected Item| PropertySheet
    Toolbar -->|Selection| Stencil
    Stencil -->|Add Glyph| App
    GlyphCanvas -->|onUpdate| App
    PropertySheet -->|onUpdate| App
    
    %% Internal Relations
    GlyphCanvas --> GlyphRenderer
    GlyphRenderer --> Basic
    GlyphRenderer --> Logic
    GlyphRenderer ...-> Glyph_Types
    GlyphRenderer --> GlyphClass
    
    %% Connections
    GlyphClass -->|Generates| Port[Port.tsx]
    GlyphCanvas -->|Calculates| Connection[Connection.tsx]

    %% Persistence
    App <--> Persistence
    App <--> History
```

## Key Project Facts

- **State Management**: Centralized in [src/App.tsx](src/App.tsx). Uses `Page` objects to support multiple canvas tabs. History (Undo/Redo) is manually tracked in a `history` stack.
- **Persistence**: Application state is automatically persisted to `sessionStorage` under the key `canvasData`.
- **Glyph System**: 
  - **Model**: Defined by the `Glyph` class in [src/glyph/Glyph.tsx](src/glyph/Glyph.tsx).
  - **Rendering**: Dispatched via [src/glyph/GlyphRenderer.tsx](src/glyph/GlyphRenderer.tsx) based on `glyph.type`.
  - **Registry**: [src/glyph/type/GlyphRegistry.tsx](src/glyph/type/GlyphRegistry.tsx) maps glyph types to metadata and custom Property Sheet components.
- **Canvas Engine**: [src/GlyphCanvas.tsx](src/GlyphCanvas.tsx) handles SVG rendering, coordinate normalization (Zoom/Pan), and connection line calculations (Bezier/Manhattan/Line).
- **Technology Stack**: React 19, Vite, TypeScript, and **Model Context Protocol (MCP)** integration via `use-mcp`.

## Getting Started

```bash
npm install
npm run dev
```

