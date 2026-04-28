# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What SetListr Does

SetListr answers: "Which album from a given artist has the most tracks I like?" Especially useful for bands with large discographies and many live albums (Grateful Dead, Phish). Users search a band, select favorite tracks, and albums are scored by how many selected tracks they contain.

## Development Setup

Two servers must run simultaneously:

```bash
brew services start mongodb-community   # MongoDB on localhost:27017
npm run start                            # Backend on port 3001
npm run dev                              # Frontend dev server (Vite) with hot reload
```

The `vite.config.ts` proxy routes `/setlistr/api` requests from the frontend dev server to `http://localhost:3001`, so no CORS issues in development.

Backend credentials: `server/secret.json` (gitignored) must contain the Spotify API secret key. The client ID is hardcoded in `server/setlistr-server.js`.

## Commands

```bash
npm run dev       # Start frontend dev server (Vite)
npm run build     # Production build to dist/
npm run start     # Start Express backend
npm run lint      # ESLint on src/**/*.{js,jsx}
npm run format    # Prettier on src/**/*.{js,jsx}
```

No test suite is wired up (Cypress is installed but has no tests).

## Architecture

**Frontend** (`src/js/` — React 17 + TypeScript + Vite):
- `App.tsx` → `SearchParams.tsx` is the main container managing all state via hooks (no Redux/Context)
- `BandList.tsx` — Spotify artist search results
- `TrackList.tsx` — Deduplicated tracks for selected artist, sortable by name or frequency (# of albums the track appears on)
- `AlbumList.tsx` — Albums scored/ranked by count of user-selected tracks
- `LoadingSpinner.tsx` — Shown while fetching album data
- `types.ts` — `Band`, `Track`, `Album` TypeScript interfaces
- Animations use `react-flip-toolkit`

**Backend** (`server/setlistr-server.js` — Express + MongoDB):
- Two endpoints: `GET /setlistr/api/bands/:search` (Spotify artist search) and `GET /setlistr/api/albums/:band` (albums for a band ID)
- Spotify Client Credentials flow; token is refreshed automatically when expired
- Albums are cached in MongoDB (`setListr.albums` collection, keyed by `bandId`). On a request for a band, existing cached albums are returned immediately and only new albums are fetched from Spotify and inserted.
- Track names are normalized before storage: parenthetical info, remix/live suffixes, and part numbers are stripped so variants of the same song deduplicate correctly.

**Deployment** (`.github/workflows/vps-deploy.yml`):
- Pushes to `master` trigger SSH deployment to a VPS via `appleboy/ssh-action`
- Remote script: pm2 stop → git pull → npm ci → npm run build → pm2 start
