# eujin.me — Entire Portfolio as a Tinder-style Mock App

A swipe-first portfolio, deliberately presented as a dating-app interface. No traditional portfolio homepage or separate marketing site. All sections live inside the app shell:

- **Discover:** swipe project cards left to skip, right to save; keyboard arrows; Undo; replay.
- **Your likes:** locally persisted project shortlist, remove items, share a URL with selected IDs.
- **The profile:** about Eu Jin, professional strengths and separate Game Production / Engineering resume views.
- **Messages:** a chat-like contact screen linking to LinkedIn (it does not imply an actual messaging backend).
- **Project details:** accessible via the information button on each card and the shortlist.

## Development

```bash
npm install
npm run dev
npm run check
npm test
npm run build
```

Production build output: `dist/`.

## Cloudflare

`wrangler.jsonc` is configured for Workers Static Assets. When ready, connect the repository to Cloudflare Workers Builds with `npm run build` and `dist` as the assets directory, or run `npm run deploy` after setting up Wrangler authentication. **Do not deploy until content and external links have been reviewed.**

## Content / editing

- Project cards: `src/data/portfolio.ts`
- Site layout and interactions: `src/components/App.tsx`
- App styling: `src/styles.css`
- Shortlist logic: `src/lib/likes.ts`

## IMPORTANT: Before publishing

1. The four card illustrations are **designed typographic placeholders**, not screenshots. Add licensed/approved actual game screenshots; do not misrepresent them.
2. Confirm project claims, especially release dates, outcomes and development timelines. The W.A.M timeline is marked for confirmation.
3. Confirm the LinkedIn URL and add a public contact email if desired.
4. Add verified game-production and engineering resume PDFs only after reviewing their contents.
5. The mock chat does **not** send messages; the CTA opens LinkedIn. The '98% match' badge is labeled as a design joke.
6. The shortlist is stored only in the visitor's browser; sharing puts project IDs into the link.

No backend, database, third-party tracking or public deployment is included.

## Design adjustment

The decorative floating text and doodles to the left and right of the Discover card deck have been removed. The card stack is now centered. All app screens and swipe controls remain unchanged.
