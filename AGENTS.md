# TACS 2026 C1 — Frontend Agent Guide

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` (port 5173) |
| Build (typecheck first) | `npm run build` |
| Typecheck only | `npx tsc -b` |
| Run all tests | `npm test` |
| Single test file | `npx vitest run path/to/file.test.ts` |
| Pattern match | `npx vitest run --reporter=verbose <keyword>` |
| Coverage | `npx vitest run --coverage` |

## Key Architecture

- **React 19 + Vite 6 + TypeScript 5.7** — no monorepo, single frontend app
- **styled-components v6.0.3** — styles co-located as `*.styles.ts` files
- **react-router-dom v7** — routes in `src/app/router/AppRouter.tsx`
- **Axios** — singleton with global 401 interceptor in `src/app/config/axiosConfig.tsx`
- **Custom `useFetch` hook** (not React Query) — returns `{ data, isLoading, error, refetch, setData }`
- **6 React Contexts** nested in `App.tsx`: `Admin > User > Notifications > Snackbar > App`
- **No form library** — plain controlled components

## Convention Notes

- UI text is **Spanish (Argentina)** — all labels, errors, statuses
- API status enums mapped: BE `ACTIVE` ↔ FE `ACTIVA` (see service files for mapping)
- SessionStorage cache for catalog (key: `figuritas_catalog`); call `clearCatalogCache()` on logout
- JWT + currentUser in localStorage (keys: `token`, `currentUser`)
- Pages under `src/app/pages/<name>/` with `PageName.tsx` + `PageName.styles.ts`
- Interfaces in `src/app/interfaces/<domain>/`
- Mock data in `src/mocks/` — used in some contexts as fallback
- No testing in CI, no precommit hooks, no Prettier — quality relies on `tsc -b` strict mode

## Existing Test Patterns (Vitest + happy-dom)

- `vi.useFakeTimers()` / `vi.setSystemTime()` for date-dependent tests
- `localStorage.clear()` / `localStorage.setItem()` for storage tests
- No component or E2E tests exist
