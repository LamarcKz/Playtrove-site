---
id: contributing
title: "Contribute to the project"
sidebar_position: 10
---

The [application repository](https://github.com/LamarcKz/Playtrove) welcomes bugs, ideas, translations and pull requests. Issues can be written in English or Portuguese.

This documentation describes stable version **1.0.0**. The `main` branch follows the stable release; ongoing work happens in `desenvolvimento`. The package version may stay unchanged until the next release.

## Prepare your environment

Use Windows with:

- **Node.js 22.12 or newer** and Git;
- **stable Rust**, installed with [rustup](https://www.rust-lang.org/tools/install), using the MSVC toolchain;
- **Visual Studio Build Tools** with the desktop development with C++ workload, which Rust uses on Windows.

WebView2, which displays the interface, already comes with Windows 10 and 11.

```bash
git clone https://github.com/LamarcKz/Playtrove.git
cd Playtrove
git switch desenvolvimento
npm install
npm run dev
```

The first `npm run dev` compiles the Rust part and takes a few minutes; after that, only what changed is rebuilt. Interface changes appear right away, and the application reopens by itself when the Rust code changes.

Create a change branch from `desenvolvimento` and target your pull request at that branch. To study exactly the version covered here, see the [v1.0.0 tag](https://github.com/LamarcKz/Playtrove/tree/v1.0.0).

## Validate a change

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Check TypeScript types |
| `npm run build` | Check types and build the interface into `out/web` |
| `npm run test:unit` | Run interface logic tests with Vitest |
| `npm run test:rust` | Run the Rust tests (`cargo test` in `src-tauri`) |
| `npm run test:app` | Build the Tauri test application and run the Playwright tests, which open its window |
| `npm test` | Run the complete suite: interface, Rust and application |
| `npm run dist` | Generate the installer, portable edition and update files in `dist/` |

For Rust, format with `cargo fmt` and keep `cargo clippy` free of warnings. Before sending a PR, run `npm test` and describe the changed behavior and how you validated it. The tests also run on GitHub, on a clean Windows machine, for every pull request.

`npm run dist` signs the installer for automatic updates and requires the project's private key, which only the maintainer holds. Without it, the command reports the missing key and stops; you do not need to build releases to contribute.

## Data and languages

DEV uses `%APPDATA%\Playtrove Dev`, a separate copy of the installed library, and its window shows the **DEV** mark. With DEV closed, `npm run dev:nova-copia` discards that copy, and the next `npm run dev` copies the library again. Tests use temporary data. Keep personal data, ROMs, keys and images from a real library out of commits, public logs and fixtures.

New application text must exist in Portuguese and English, in the dictionaries under `src/shared/i18n`. Text shown by Rust comes from the same dictionaries: after changing it, run `npm run tauri:mensagens` to regenerate `src-tauri/messages.json`. Changes to this guide should keep both languages consistent too. Use Conventional Commits for commit messages.

Read the [architecture](architecture.md) before choosing where to implement a change. The [website has its own repository](https://github.com/LamarcKz/Playtrove-site); the commands above are for the application.
