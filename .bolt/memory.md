# Project memory

## Product intent & audience

- Vite + React app; specific product intent and audience not yet established.

## Brand personality & voice

- Not yet established from available context.

## Visual design & UX direction

- No design or UX specifics inferred yet; current focus is on environment/build stability rather than UI.

## Decisions, constraints & rationale

- Stack: Vite + React.
- `bun.lock` is present, so Bun is available/preferred for dependency installation.
- `npm install` can fail with network errors such as `ECONNRESET`, leaving `node_modules` incomplete and causing preview/dev server failures.
- After installing dependencies successfully with Bun, the project builds cleanly and preview should work.

## Open questions & assumptions

- Assumes Bun is the intended package manager due to the lockfile; confirm if another manager should be used.
- Product purpose, audience, design direction, and deployment target are still unknown.
- If install failures recur, retrying or switching to Bun is a reasonable first troubleshooting step.