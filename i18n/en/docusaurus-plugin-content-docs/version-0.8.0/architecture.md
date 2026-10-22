---
id: architecture
title: "Application architecture"
sidebar_position: 11
---

In version 0.8.0, Playtrove is a **Tauri 2** application: the back end is written in **Rust**, and the interface is still React and TypeScript with Tailwind/shadcn styling, displayed by Windows' WebView2. Data is stored in SQLite through rusqlite, with SQLite bundled into the application. Up to 0.7.x, Playtrove used Electron; the interface is the same.

## The parts

| Part | Responsibility |
| --- | --- |
| `src/renderer` | Screens, React components, search and data presentation |
| `src/renderer/lib/tauriApi.ts` | Bridge that builds `window.api` and connects each function to a Rust command |
| `src-tauri/src` | Window, SQLite, files, emulators, controller and external integrations, with one Rust module per subject |
| `src/shared` | Types, event names, languages and the `AppApi` contract (`ipc.ts`) |

The interface calls `window.api`. The bridge turns each function into the Rust command with the same name in snake_case: `games.setStatus` calls `games_set_status` in `src-tauri/src/commands.rs`. Commands validate the values they receive before using them and return errors already in the application's language. In the other direction, Rust emits events; after a library change, for example, `library:changed` makes the interface reload its data.

The interface only talks to Rust through these commands: it does not read the disk or open addresses on its own. Game images arrive through an application protocol limited to its image folder.

## Data and integrations

Rust maintains a local SQLite connection. Migrations update the data structure; the first eight are the same as in the Electron versions, in the same order, so a 0.7.x database opens directly. A schema change should add a migration while preserving previously published migrations.

Metadata modules query IGDB, SteamGridDB and libretro-thumbnails; achievement modules query RetroAchievements and read RPCS3's local files. API keys are protected by Windows (DPAPI) in the same format as Electron's secure storage, so keys saved in 0.7.x remain valid. Rust reads the DualSense through the `hidapi` library.

Updates go through the Tauri updater, which only installs versions signed with the project's key.

## Tests and reference code

| Tests | What they check |
| --- | --- |
| Vitest (`tests/unit`) | Interface logic, the dictionaries for both languages, and the text Rust uses |
| Rust (`cargo test`) | Back-end logic, at the end of each module, with an in-memory database and temporary folders |
| Playwright (`tests/app`) | Flows in the Tauri application, built for testing and opened with temporary data |

Tests replace external integrations with fake services and files, and they never open a real emulator.

For details of the documented version, see the [v0.8.0 project map](https://github.com/LamarcKz/Playtrove/blob/v0.8.0/ESTRUTURA.md), the [interface contract](https://github.com/LamarcKz/Playtrove/blob/v0.8.0/src/shared/ipc.ts) and the [Rust commands](https://github.com/LamarcKz/Playtrove/blob/v0.8.0/src-tauri/src/commands.rs).

The `desenvolvimento` branch may contain structure and behaviors newer than this guide. See [contributing](contributing.md) to prepare your environment.
