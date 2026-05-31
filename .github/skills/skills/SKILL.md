---
name: run-tests
description: Run the test suite for the R_js_draw project.
---

# Run Tests

This skill runs the test suite for the R_js_draw project and reports the results.

## Steps

1. Ensure you are in the project root directory (`/Users/vippulpandit/project/R_js_draw`).
2. If the test runner is not available or dependencies are missing, respond with: "Test runner not available. Run `npm install` first, then retry."
3. Execute the appropriate test command:
   - **Watch mode (interactive):** `npm test`
   - **Single run:** `npm run test:run`
   - **With coverage:** `npm run coverage`
4. Parse the output and report:
   - Total number of tests passed and failed.
   - Names and locations of any failing tests.
   - Coverage summary if the coverage command was used.

## Error Handling

- If `npm test` or `npm run test:run` cannot be found, instruct the user to run `npm install` first.
- If individual tests fail, list each failing test by file and test name, and include the failure message.
- If the build step fails before tests run, surface the TypeScript or Vite compilation error.

## Example Output

```
Test run complete: 48 passed, 1 failed.

Failing test:
  File: src/__tests__/GlyphCanvas.test.tsx
  Test: "should render a rectangle glyph at the correct position"
  Error: expected x to be 100, got 0

Run `npm run coverage` to see a full coverage report.
```