---
id: contributing
title: "Contribute to the project"
sidebar_position: 10
---

The [application repository](https://github.com/LamarcKz/Playtrove) welcomes bugs, ideas, translations and pull requests. Issues can be written in English or Portuguese.

This documentation describes stable version **0.7.0**. The `main` branch follows the stable release; ongoing work happens in `desenvolvimento`. The package version may stay unchanged until the next release.

## Prepare your environment

Use Windows and **Node.js 22.12 or newer**, plus Git. The documented application workflow does not require Visual Studio or a C++ compiler.

```bash
git clone https://github.com/LamarcKz/Playtrove.git
cd Playtrove
git switch desenvolvimento
npm install
npm run dev
```

Create a change branch from `desenvolvimento` and target your pull request at that branch. To study exactly the version covered here, see the [v0.7.0 tag](https://github.com/LamarcKz/Playtrove/tree/v0.7.0).

## Validate a change

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Check types |
| `npm run build` | Check types and build `out/` |
| `npm run test:unit` | Run logic tests with Vitest |
| `npm run test:app` | Build and open Electron for Playwright tests |
| `npm test` | Run the complete suite |
| `npm run dist` | Generate the installer and portable edition in `dist/` |

Before sending a PR, run `npm test` and describe the changed behavior and how you validated it.

## Data and languages

DEV uses `%APPDATA%\Playtrove Dev`, a separate copy of the installed library. Tests use temporary data. Keep personal data, ROMs, keys and images from a real library out of commits, public logs and fixtures.

New application text must exist in Portuguese and English. Changes to this guide should keep both languages consistent too. Use Conventional Commits for commit messages.

Read the [architecture](architecture.md) before choosing where to implement a change. The [website has its own repository](https://github.com/LamarcKz/Playtrove-site); the commands above are for the application.
