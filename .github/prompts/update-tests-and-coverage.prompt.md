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
- Fix the test (or the source bug if the test is correct)
- Re-run `npm run test:run` to confirm all tests pass before continuing

### 3. Add new unit tests for uncovered code

**Do NOT run `npm run coverage` in this step.** Instead, read the existing report from `coverage/index.html` to identify gaps. Running coverage here would regenerate the report before new tests are written, making the data used to guide test authoring stale.

#### 3a. Identify files with insufficient coverage

Read `coverage/index.html` and list all files with **below 80% statement coverage**.

#### 3b. Filter out non-testable files

Remove from the list any file that meets one of these criteria (these are not worth unit-testing at this stage):
- `main.tsx` (app entry point with no logic)
- Files whose entire render output is a single static SVG element with no props-driven branching logic, conditional rendering, or event handlers

#### 3c. Sort by priority tier

Order the remaining files:
1. `src/glyph/` and subfolders model classes with logic (e.g. `Page.tsx`, any helpers)
2. `src/` and subfolders UI components with props/callbacks (e.g. `Toolbar.tsx`, `BottomTabs.tsx`)
3. Glyph type components that have branching logic (multiple `case` branches or conditional JSX)

#### 3d. Write tests for each file

For each file in priority order:
- Read the source file
- Create or update a test file in `src/__tests__/` following the `.test.ts` / `.test.tsx` naming convention
- Use **vitest** globals (`describe`, `it`, `expect`, `vi`)
- For React components with heavy SVG child imports: mock each child with `vi.mock(...)`
- For components that render SVG elements directly: wrap renders in `<svg>` using the `renderInSvg` helper (see Key conventions below)

#### 3e. Confirm no regressions

After writing all new tests, run `npm run test:run` again. If any new failures appear, fix them before proceeding to Step 4.

### 4. Regenerate the coverage report

Run `npm run coverage`. If the command exits with a non-zero code, report the full error output and stop — do not fabricate coverage numbers.

On success, report the final coverage table showing:
- Overall % Stmts, % Branch, % Funcs, % Lines
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
