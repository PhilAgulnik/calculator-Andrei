# CLAUDE.md

## Project Overview
This repository produces **prototype features** for UK benefits calculators.
- Company: [Entitledto](https://www.entitledto.co.uk/) — UK benefits calculators for local authorities and public self-serve use.
- Core prototype area: `src/products/benefits-calculator/`
- Outputs must be usable by business stakeholders (clear, reviewable behavior) and developers on legacy production stacks (implementation guidance).

## Tech Stack
- React 19 + TypeScript + Vite
- TanStack Router (`routeTree.gen.ts` is auto-generated — do not edit)
- TanStack Form (informed)
- Tailwind CSS v4
- Vitest for testing

## Key Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run serve        # Preview production build

# Tests — use --pool threads on Windows to avoid fork timeout
npx vitest run --pool threads                        # All tests
npx vitest run --pool threads src/path/to/test.ts    # Single file
```

## Working Rules

### Source of Truth
When documentation conflicts with implementation:
1. Prefer current code in `src/` (authoritative)
2. Use docs for background/migration rationale
3. Flag conflicts explicitly

### Before Implementing
Ask clarifying questions if any of these are unclear:
- Country/jurisdiction-specific rule behavior
- Benefit policy year/rate source
- Whether task is prototype-only vs intended for production parity
- Scope boundaries across admin/shared vs calculator modules

### Code Quality
- Keep changes modular and localized.
- Prefer extending existing utilities/components over duplicating logic.
- Keep calculation logic deterministic and traceable.
- Keep policy constants and thresholds explicit and easy to review.
- Do not use legacy frontend frameworks (Angular.js, jQuery) — prototype code stays modern.
- Run existing tests after changes; fix any regressions.

## Production Context (Handoff Awareness)
The legacy production stack uses:
- .NET Framework 4.6
- Microsoft SQL Server
- ASP.NET MVC SSR pages with Angular.js and jQuery

When relevant, include brief **Production Handoff Notes** with:
- Business rule intent and data points/thresholds touched
- Suggested mapping to .NET/SQL/legacy UI layers
- Risks or assumptions requiring developer validation

## Delivery Checklist
For each feature or change, provide:
1. **Summary** — what changed and why (plain language)
2. **Files changed**
3. **Validation** — manual test steps performed and results; run automated tests if they exist for the area
4. **Handoff notes** — if relevant to production teams
5. **Doc updates** — update `CLAUDE.md` only for significant architectural or policy changes

## Known Issues
- `authManager.test.ts` — 2 pre-existing failures (message text mismatch, attempts count)
- `themeManager.test.ts` — 3 pre-existing failures (getThemeForRoute returns wrong theme)
