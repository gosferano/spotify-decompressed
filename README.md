# Spotify Decompressed

A viewer for your Spotify **extended streaming history**. Drop in the zip
archive Spotify sends you and explore your listening stats: total time played,
top tracks, artists and albums, filtered by date range, sorted by play count or
duration, with or without skipped plays.

Live at <https://gosferano.github.io/spotify-decompressed/>.

Everything runs in your browser. The archive is never uploaded anywhere; parsed
history is cached locally (IndexedDB) so it is still there on your next visit.

## Getting your data

1. Go to your [Spotify account privacy page](https://www.spotify.com/account/privacy/).
2. Request **Extended streaming history**. Spotify emails a download link,
   which can take up to 30 days.
3. Open the app and drop the downloaded `.zip` onto the upload area. Both the
   `MyData/…` and `Spotify Extended Streaming History/…` archive layouts are
   supported.

## Development

Built with [Nuxt 3](https://nuxt.com/docs) (client-side only), Pinia and
[Oruga](https://oruga-ui.com/) with the Bulma theme.

```bash
npm install
npm run dev       # dev server on http://localhost:3000/spotify-decompressed/
npm run lint      # ESLint + Prettier
npm run lintfix   # auto-fix lint and formatting
npm run build     # production build
npm run preview   # preview the production build
```

The stats logic lives in `utils/spotifyHistory/`; the UI is in `pages/` and
`components/`.

## Deployment

Every push to `main` is built and deployed to GitHub Pages by
`.github/workflows/deploy-pages.yml`.
