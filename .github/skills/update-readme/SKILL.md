---
name: update-readme
description: Create or update the README.md file for the R_js_draw project by scanning the current codebase state.
---

# Update README

This skill creates or updates `README.md` at the project root to accurately reflect the current state of the R_js_draw codebase.

## When to Use

- The README is missing or empty.
- New glyph categories, components, or features have been added.
- Scripts, dependencies, or the Docker/Podman setup have changed.
- The architecture diagram is out of date.

## Steps

1. **Read the current README** (if it exists) at `/Users/vippulpandit/project/R_js_draw/README.md` to understand what is already documented.
2. **Gather codebase facts** by inspecting the following locations:
   - `package.json` — scripts, dependencies, and version numbers.
   - `src/glyph/type/` — list all category subdirectories and the files within each to enumerate glyph types.
   - `src/glyph/GlyphRenderer.tsx` — confirm which glyph types are actively rendered.
   - `src/glyph/type/GlyphRegistry.tsx` — confirm registered glyph metadata.
   - `Dockerfile` — note the Node and nginx versions used.
   - `src/App.tsx` — note state management and persistence patterns.
   - `src/GlyphCanvas.tsx` — note canvas/rendering capabilities.
3. **Identify what has changed or is missing** by comparing gathered facts against the existing README content.
4. **Update only the sections that are stale or absent.** Sections to maintain:
   - Project overview (one-liner description, tech stack table)
   - Architecture diagram (Mermaid `graph TD`)
   - Key project facts
   - Glyph categories table (one row per category with location and shapes)
   - Category-specific deep-dive sections (BPMN, UML, etc.) when the category is large enough to warrant one
   - Adding a New Glyph Type workflow
   - Getting Started (`npm install` / `npm run dev`)
   - Available Scripts table (derived from `package.json` `scripts`)
   - Docker section (build + run commands)
   - Podman section (build, run, rootless, detached, stop/remove)
   - Key Files table
5. **Preserve** all content that is already accurate. Do not rewrite sections that are up to date.
6. **Write the updated content** to `README.md`.

## Rules

- Use Markdown only. No HTML tags.
- Use `mermaid` fenced code blocks for architecture diagrams.
- All file references must be relative links, e.g. `[src/App.tsx](src/App.tsx)`.
- Keep the tone concise and technical.
- Do NOT add speculative features or roadmap items.
- Do NOT remove existing documented sections unless the underlying code no longer exists.

## Error Handling

- If `package.json` cannot be read, skip the Scripts section and note it could not be verified.
- If `src/glyph/type/` cannot be listed, keep the existing Glyph Categories table and add a note that it may be stale.
- If the README does not exist, create it from scratch using all gathered facts.

## Example Output (confirmation message)

```
README.md updated.

Changed sections:
  - Glyph Categories table: added "aws/" category (S3Glyph, LambdaGlyph)
  - Available Scripts table: added "deploy" script
  - Architecture diagram: added AwsGlyph node under Glyph_Types

No changes needed in: Getting Started, Docker, Podman, Key Files.
```
