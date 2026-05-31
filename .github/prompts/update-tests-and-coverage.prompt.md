---
description: "Update unit tests and regenerate the coverage report for the R_js_draw project. Use when: update tests, run coverage, refresh coverage, update coverage folder."
name: "Update Tests & Coverage"
agent: "agent"
---

You are working on the **R_js_draw** React/TypeScript diagramming project located at the workspace root.

## Task

Perform the following steps in order:

### 1. Run the existing test suite

Run `npm run test:run` and report:
- Total tests passed / failed
- Which test files ran
- Any failures with the exact error message

### 2. Fix any failing tests

If any tests fail:
- Read the relevant source file and test file to understand the failure
- Decision rule for fixing: if the test asserts behavior that matches the current specification or existing passing tests, fix the source. If the test assertion is incorrect or outdated relative to the source, fix the test. When uncertain, report the ambiguity and do not modify source.
- Re-run `npm run test:run` to confirm all tests pass before continuing

### 3. Add new unit tests for uncovered code

**Do NOT run `npm run coverage` in this step.** Instead, read the existing report from `coverage/index.html` to identify gaps. Running coverage here would regenerate the report before new tests are written, making the data used to guide test authoring stale.

If `coverage/index.html` does not exist, run `npm run coverage` once to generate it, then continue with step 3a using the freshly generated report.

#### 3a. Identify files with insufficient coverage

Read `coverage/index.html` and each of the following subfolder index files to get per-file data for every source subdirectory:
- `coverage/src/index.html`
- `coverage/src/glyph/index.html`
- `coverage/src/glyph/type/basic/index.html`
- `coverage/src/glyph/type/bpmn/index.html`
- `coverage/src/glyph/type/flowchart/index.html`
- `coverage/src/glyph/type/logic/index.html`
- `coverage/src/glyph/type/mcp/index.html`
- `coverage/src/glyph/type/network/index.html`
- `coverage/src/glyph/type/uml/index.html`
- `coverage/src/glyph/type/util/index.html`
- `coverage/src/glyphCanvas/index.html`
- `coverage/src/hooks/index.html`

List all files with **below 80% statement coverage**.

#### 3b. Filter out non-testable files

Remove from the list any file that meets one of these criteria (these are not worth unit-testing at this stage):
- `main.tsx` (app entry point with no logic)
- Files whose entire render output is a single static SVG element with no props-driven branching logic, conditional rendering, or event handlers

#### 3c. Sort by priority tier

Order the remaining files:
1. `src/glyph/` and subfolders model classes with logic (e.g. `Page.tsx`, any helpers)
2. `src/` and subfolders UI components with props/callbacks (e.g. `Toolbar.tsx`, `BottomTabs.tsx`)
3. Glyph type components that have branching logic (multiple `case` branches or conditional JSX)

#### 3c-checkpoint. Output the prioritized file plan

Before writing any tests, output an explicit list of every file you will test in the format:
```
[Tier N] path/to/File.tsx — test pattern: <vi.mock | renderInSvg | plain>
```
Do not proceed to 3d until this list is complete and correct.

#### 3d. Write tests for each file

For each file in priority order:
- Read the source file
- Create or update a test file in `src/__tests__/` following the `.test.ts` / `.test.tsx` naming convention
- Use **vitest** globals (`describe`, `it`, `expect`, `vi`)
- For React components with heavy SVG child imports: mock each child with `vi.mock(...)`
- For components that render SVG elements directly: wrap renders in `<svg>` using the `renderInSvg` helper (see Key conventions below)

#### 3e. Confirm no regressions

After writing all new tests, run `npm run test:run` again. If any new failures appear, fix them before proceeding to Step 4.

If a new failure appears only in a pre-existing test file (not in any file you just wrote), check whether a new `vi.mock` call in your added tests is affecting module resolution globally. If so, scope the mock with `vi.doMock` or add `vi.resetModules()` in the affected test's `beforeEach`.

If all tests pass but you believe additional iterations would meaningfully improve coverage, you may repeat steps 3a–3d once more before proceeding to Step 4. Do not iterate more than twice.

### 4. Regenerate the coverage report

Run `npm run coverage`. If the command exits with a non-zero code, report the full error output and stop — do not fabricate coverage numbers.

On success, report the final coverage table showing:
- Overall % Stmts, % Branch, % Funcs, % Lines
- Per-subfolder breakdown (e.g. `src/`, `src/glyph/`, `src/glyph/type/basic/`, `src/glyph/type/bpmn/`, `src/glyph/type/flowchart/`, `src/glyph/type/logic/`, `src/glyph/type/mcp/`, `src/glyph/type/network/`, `src/glyph/type/uml/`, `src/glyphCanvas/`, `src/hooks/`)
- Per-file breakdown for files that changed

### Key conventions

- Test files live in `src/__tests__/` and subfolders and must be named `*.test.ts` or `*.test.tsx`
- Vitest config: `globals: true`, `environment: "jsdom"`, `setupFiles: ["./src/setupTests.ts"]`
- The Glyph constructor signature is: `(id, type, x, y, ports=[], data={}, label="", inputs=2, outputs=1, attrs=[], methods=[], width=120, height=80, icon?)`
- jsdom drag events have no `dataTransfer` — always supply `{ dataTransfer: { setData: vi.fn(), effectAllowed: "" } }` in `fireEvent.dragStart`
- The `Connection.fromJSON` arg order (fixed): `(obj.label || "", obj.type || "default")`
- GlyphRenderer tests must mock all child glyph imports individually via `vi.mock(...)`
- The `renderInSvg` helper is defined inline in each test file as:
  ```ts
  const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);
  ```
  If a shared version is needed, create it at `src/__tests__/testUtils.ts` and import from there.
