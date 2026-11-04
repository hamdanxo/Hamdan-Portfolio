# Muhammad Hamdan, portfolio

Personal portfolio built with **Next.js 16 (App Router)**, **TypeScript**, **Three.js** and **Lenis**.

## Stack

| Part | What it does |
| --- | --- |
| Next.js App Router | Static pages (`/` and `/work`), image optimisation, fonts, SEO metadata, sitemap and robots |
| TypeScript (strict) | Type safety across components, effects and data |
| Three.js | Liquid-metal shader background, loaded only after the first interaction |
| Lenis | Smooth momentum scrolling and anchor links |
| next/font (local) | Self-hosted, subset fonts: no layout shift, no third-party requests |
| next/image | AVIF/WebP, responsive sizes, priority hero image |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint (next/core-web-vitals + TypeScript rules)
npm run typecheck  # tsc --noEmit
```

## Project layout

```
src/
  app/            routes, layout, fonts, sitemap, robots, icon
  components/
    home/         home page sections (server components)
    work/         work page sections + DesignGallery (client)
    layout/       header, footer, background glows
    effects/      small client components: scroll, reveal, cursor, card flip, Three.js background
  data/designs.ts graphic design entries for the gallery
  lib/            shared helpers (motion, idle effects, site config)
  styles/         globals.css, work.css, components.css
```

## Adding a graphic design

1. Put the image in `public/designs/` (for example `public/designs/brand-poster.webp`).
2. Add an entry in `src/data/designs.ts`:

```ts
{ client: 'Client name', title: 'Design name', year: '2026', tags: ['Poster', 'Print'], img: '/designs/brand-poster.webp' },
```

The gallery and list view update automatically.

## Performance notes

- Hero layout runs inline before first paint, so the hero image never shifts.
- All effects start in idle time (`useIdleEffect`), keeping hydration short.
- Three.js is fetched only after the visitor interacts, and devices without a real GPU get a still frame.
- Old `/index.html` and `/projects.html` links redirect to `/` and `/work`.
