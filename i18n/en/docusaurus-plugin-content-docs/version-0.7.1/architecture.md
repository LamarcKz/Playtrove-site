---
id: architecture
title: "Application architecture"
sidebar_position: 11
---

In version 0.7.1, Playtrove is an **Electron** application with a React and TypeScript interface, Tailwind/shadcn styling, and SQLite persistence through better-sqlite3.

## The parts

| Part | Responsibility |
| --- | --- |
| `src/renderer` | Screens, React components, search and data presentation |
| `src/preload` | Bridge exposing specific operations through `window.api` |
| `src/main` | Window, SQLite, files, emulators and external integrations |
| `src/shared` | Types, IPC channels, languages and shared contracts |

The interface calls `window.api`; the preload forwards operations to the main process through IPC. After a library change, the main process tells the interface to reload its data.

The renderer has no direct access to Node.js. Controller reading uses WebHID directly in the interface, with access authorized by the main process.

## Data and integrations

The main process maintains a local SQLite connection. Migrations update the data structure. A schema change should add a migration while preserving previously published migrations.

Metadata modules query IGDB, SteamGridDB and libretro-thumbnails; achievement modules query RetroAchievements and read RPCS3's local files. Keys are protected with Electron's secure storage.

## Tests and reference code

Vitest checks logic and the database; Playwright opens an Electron instance with temporary data to check flows. Tests replace external integrations with fake services and files.

For details of the documented version, see the [v0.7.1 project map](https://github.com/LamarcKz/Playtrove/blob/v0.7.1/ESTRUTURA.md) and [IPC contract](https://github.com/LamarcKz/Playtrove/blob/v0.7.1/src/shared/ipc.ts).

The `desenvolvimento` branch may contain structure and behaviors newer than this guide. See [contributing](contributing.md) to prepare your environment.
