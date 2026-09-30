# AGENTS.md

## Stack & requirements

- **Language:** TypeScript, ESM (`"type": "module"` in `package.json`).
- **Runtime:** Node.js 22 or newer (CI uses Node 24). There is no `engines`
  field and no `.nvmrc`.
- **Package manager:** npm only (there is just a `package-lock.json`). Do not
  introduce `yarn` or `pnpm` lockfiles.

## Architecture

- `src/calc.ts` — pure math (`randomBits`, `criticalNumber`, `timeToCollision`, `UUID_RANDOM_BITS`).
- `src/format.ts` — result/time formatting helpers.
- `src/alphabets.ts` — alphabet presets.
- `src/state.ts` — custom store: `getState` / `setState` / `subscribe`.
- `src/code-sample.ts` — code snippet generation/highlighting.
- `src/main.ts` — DOM wiring and event listeners; **entry point** of the bundle.
- `build.mjs` — production build script (bundles `src/main.ts`, minifies CSS, copies assets).
- `public/` — static assets (`index.html`, CSS, images).

Pure logic is kept separate from DOM code: keep it out of `main.ts`.

## Commands

| Task                     | Command                                                     |
| ------------------------ | ----------------------------------------------------------- |
| Install dependencies     | `npm ci`                                                    |
| Dev server (live reload) | `npm run dev`                                               |
| Type-check sources       | `npm run typecheck`                                         |
| Run all tests            | `npm test`                                                  |
| Run a single test file   | `node --import tsx --test src/calc.test.ts`                 |
| Production build         | `npm run build` (output in `dist/`)                         |

## Git conventions

- Default branch: `master`; feature branches are named `feat/...`.
- Commit messages are plain imperative subject lines in sentence case with no
  prefix and no ticket — e.g. `Add alphabet preset dropdown`. Do **not** use
  Conventional Commits (`feat:`, `fix:`, …).
- Only commit and push when the user explicitly asks you to.

## Rules

- Always respond to the user in Russian.
