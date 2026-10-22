# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Love Link" — a Valentine's site builder. Logged-in users create a shareable `/:slug` page that asks someone a yes/no question (with an evasive "No" button), optionally collects date-planning preferences, and reports responses back to the creator. Vite + React 19 + react-router 7 + TanStack Query + TypeScript + Tailwind 3 + shadcn/ui on the frontend; Supabase (Postgres, Auth, Storage, Edge Functions) as the only backend. Originally scaffolded with Lovable.

## Commands

Requires Node 24 (`.nvmrc`; run `nvm use`). CI builds on Node 24 too.

```sh
npm i                 # install (npm is canonical; CI uses `npm ci`. bun.lockb also exists)
npm run dev           # dev server on http://localhost:8080
npm run build         # production build to dist/ (also copies index.html -> 404.html)
npm run lint          # eslint (includes React Compiler rules from eslint-plugin-react-hooks 7)
npm test              # vitest run (jsdom, setup in src/test/setup.ts)
npx vitest run src/path/to/file.test.ts   # single test file
npx vitest run -t "test name"             # single test by name
npx tsc --noEmit -p tsconfig.app.json     # type-check (the build does not type-check)
```

Tests live next to source as `src/**/*.{test,spec}.{ts,tsx}` (e.g. `src/components/ui/calendar.test.tsx`). `supabase/functions/` (Deno) is excluded from eslint.

## Environment

`.env` (gitignored) needs `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, optionally `VITE_SUPABASE_PROJECT_ID`, `VITE_GA_MEASUREMENT_ID`, and `VITE_BASE_PATH` (build-time `base`; must be `/` because of the custom domain).

## Deployment

Push to `main` → `.github/workflows/deploy-pages.yml` builds and deploys `dist/` to GitHub Pages at `https://lovelink.merchandice.in`. Env values come from repo Actions variables/secrets. Because GitHub Pages has no server-side routing, the Vite plugin in `vite.config.ts` copies `index.html` to `404.html` so client routes like `/:slug` work. Changing domains means updating `public/CNAME`, URLs in `index.html`, `public/sitemap.xml`, `public/robots.txt`, and Supabase Auth redirect/Site URL settings.

Google Analytics is injected at build time by a Vite plugin only when `VITE_GA_MEASUREMENT_ID` is set (with `send_page_view: false`); `GoogleAnalyticsRouteTracker` sends page views on route changes.

## Architecture

**Routing** (`src/App.tsx`): fixed routes (`/`, `/auth`, `/auth/callback`, `/dashboard`, `/create`, `/edit/:id`, `/responses/:id`) followed by a catch-all `/:slug` → `ValentineSite`. Any new top-level route must be declared before `/:slug`, and it effectively reserves that slug.

**Data model** (Supabase, `public` schema — types in `src/integrations/supabase/types.ts`, schema in `supabase/migrations/`):
- `valentine_sites` — one row per site, owned by `user_id`; holds copy, `theme`, `template`, date-planning options, `background_photos`, password fields, and counters.
- `valentine_sites_public` — a view over published sites that omits `password_hash` and `user_id`. **The public page (`ValentineSite.tsx`) must read from this view, never the base table.** Add new public columns to the view via a migration.
- `site_responses` and `date_preferences` — anonymous inserts from visitors; read by the owner in `Responses.tsx`.
- RPCs `increment_view_count` / `increment_yes_count` update counters.
- Storage bucket `valentine-photos` holds uploaded background photos (`PhotoUploadConfig.tsx`).

**Edge functions** (`supabase/functions/`, Deno):
- `verify-site-password` (`verify_jwt = false`) — uses the service role key to check a password against `password_hash`, so the hash never reaches the browser. Passwords are currently stored in plain text in `password_hash`.
- `cleanup-stale-photos` (`verify_jwt = true`) — invoked after create/edit saves to delete storage objects no longer referenced by any site.

**Editor ↔ renderer split**: `CreateSite` and `EditSite` both wrap `SiteEditorForm` (form + live preview) and differ only in load/insert/update logic. The same `TemplatePreview` component renders both the live preview in the editor and the real public page, dispatching on `template` (`classic` | `meme_gif` | `teddy_bear`) to `src/components/templates/*Preview.tsx`. Each template receives `config` (copy + `theme`), optional date-planning config, photos and display mode, and `onYesClick` / `onDateFormSubmit` callbacks; in the editor these are no-ops, on the public page they write to Supabase. Themes (`cute`, `minimal`, `dark`, `pastel`, `chaotic`) are defined in `src/types/site.ts`; shared template constants (No-button escalation text, per-theme GIFs) are in `src/components/templates/shared.ts`. Adding a template or theme means touching the selector, `TemplatePreview`, the template components, and the DB value used in `valentine_sites.template`/`theme`.

**Auth**: `AuthContext` wraps the app around the Supabase client (`src/integrations/supabase/client.ts`, PKCE flow, session in localStorage). Owner pages check the session themselves: show a spinner while auth loads, `<Navigate to="/auth">` when signed out, then gate queries with `enabled: !!user`.

**Data fetching**: reads go through TanStack Query (`QueryClientProvider` in `App.tsx`; client and keys in `src/lib/queryClient.ts`). Every owner-side key lives under `["sites", …]` (`queryKeys.mySites` / `site` / `siteResponses`), so after any create/edit/delete invalidate `["sites"]` and every owner view refreshes; the public page uses `queryKeys.publicSite(slug)`. `EditSite` loads the row and then mounts `EditSiteForm`, whose form state is initialized once from it, so don't sync query data into state with an effect. Visitor writes on the public page (view/yes inserts, date preferences) are plain fire-and-forget calls.

**Decorative randomness** (floating hearts, confetti) comes from `src/lib/decorations.ts` via a lazy `useState(() => …)` so it's picked once per mount. Calling `Math.random()` during render fails lint and makes elements jump on every re-render. Templates reset their state on theme change by remounting (`key={config.theme}` in `TemplatePreview`), not through an effect.

## Conventions

- Import from `src` via the `@/` alias.
- `src/components/ui/` is generated shadcn/ui (`components.json`); prefer adding components with the shadcn CLI over hand-editing.
- `src/integrations/supabase/client.ts` and `types.ts` are generated; regenerate types from the Supabase project (`supabase/config.toml` has the project id) after schema changes rather than hand-editing.
- `scripts/` (photo export/import, auth migration utilities) is gitignored and local-only.
