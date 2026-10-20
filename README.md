# Playtrove website

**English** · [Português](README.pt-BR.md)

[Website](https://lamarckz.github.io/Playtrove-site/en/)

The public website, documentation and release news for [Playtrove](https://github.com/LamarcKz/Playtrove), a game library manager for Windows. This repository contains the website only; the desktop application has its own repository and release process.

The site follows Playtrove's visual style and offers the same pages in English and Portuguese. User and contributor guides show the latest reviewed stable documentation snapshot, labeled with its actual version and never newer than the latest published application release. New releases update downloads and news automatically; guides advance after a separate review. News posts reuse each language of the published GitHub release notes, without an AI service or a separate editorial copy. Markdown is converted and sanitized; active HTML and remote images are not embedded.

The home page presents the real Playtrove 0.7.1 interface through a local, silent demo video and images in both languages. The video loops while visible, includes playback controls, and pauses when it leaves the screen or the tab is hidden. A visitor's pause is preserved. Reduced motion starts with a still image and manual playback; the same image remains available if video playback fails. Downloads continue to follow the latest published release, independently of the recorded demo version.

## Develop locally

Use Node.js 24 and npm. From this repository:

```sh
npm ci
npm run dev
```

This serves the website locally. It does not start the desktop application or access its library.

| Command | Purpose |
| --- | --- |
| `npm test` | Check the release processing and site contracts |
| `npm run build:test` | Build with local release fixtures, without fetching live releases |
| `npm run build` | Fetch published application releases and build the public site |
| `npm run test:site` | Check the built site in headless Chromium, without screenshots |

For browser checks, first install Chromium with `npx playwright install chromium`, then run `npm run test:site` after a build. The generated site goes into `build/`. Generated release posts and build output are not edited or committed manually. For release automation, Pages setup and the GitHub App connection, see [MAINTENANCE.md](MAINTENANCE.md).

## Demo media

Media production is a separate manual maintenance task, outside builds, tests, and CI. It opens only an isolated application instance with a temporary demo library; it never uses a person's library, API keys, ROMs, or installed emulators. The application sources remain unchanged.

With dependencies installed here and a compiled stable application checkout available, run:

```sh
npx playwright install ffmpeg
node scripts/capture-demo.mjs --app-dir "<application-checkout>"
```

Announce the application window before running the capture. The script records only that window at 1280 × 800, producing equivalent Portuguese and English WebM clips of approximately 25–30 seconds, posters, and feature images. Review the resulting media for privacy and verify playback before committing it. See [MAINTENANCE.md](MAINTENANCE.md) for output paths and the recording contract. Website tests remain headless and do not record screenshots, videos, or traces.

## Publishing

Pull requests to `main` run tests and a fixture build. A push to `main`, or a dispatch of `deploy.yml` on `main`, runs tests, reads the application's published releases and deploys to GitHub Pages. The application's release workflow can send that dispatch through a GitHub App installed only on this repository.

For assisted one-time setup, run `node scripts/setup-github-app.mjs` and open the loopback URL printed in the terminal. A person signs in to GitHub, reviews and creates the App, then installs it only on `Playtrove-site`. The helper saves the Client ID as an Actions variable and sends the private key directly through standard input to `gh secret set` in the application repository, without a key file or credential logs. The [maintenance guide](MAINTENANCE.md) also includes the manual alternative.

Application installers remain on [GitHub Releases](https://github.com/LamarcKz/Playtrove/releases). This repository does not build, sign or publish the desktop application, and does not hold its API keys or user data.

## Contribute

Keep both languages aligned, verify behavior against the latest stable app, and run the offline checks before proposing a change. Use fictitious data in tests. Follow [AGENTS.md](AGENTS.md) when working with a coding agent.
