# Next.js migration track

This branch introduces the Next.js App Router as an isolated migration track. The current Vite application remains available through the `dev:vite` and `build:vite` scripts for fallback and comparison.

## Initial stage

- Next.js App Router owns the root document, global metadata, and route entry points.
- Existing project/CMS pages are temporarily hosted in a client-only shell. This preserves the app's current browser-based route handling while Next-specific routing and data rendering are migrated incrementally.
- The catch-all route preserves deep links such as `/projects/zia-emerald` and `/admin`.
- Tailwind CSS v4 uses the PostCSS plugin shared by Next.js and the Vite fallback.

## Commands

- `bun run dev`: Next.js development server at port 3000
- `bun run build`: Next.js production build
- `bun run start`: start the production server
- `bun run dev:vite`: legacy Vite development server
- `bun run build:vite`: legacy Vite production build

## Production follow-up

This is a compatibility-first migration, not the final server-rendered implementation. Before switching production traffic, migrate the legacy route handling to App Router pages/layouts, use Next.js metadata for project-specific SEO, move Firebase access behind appropriate client/server boundaries, optimize local images, and run end-to-end tests for leads, KPR calculator, login, and CMS.
