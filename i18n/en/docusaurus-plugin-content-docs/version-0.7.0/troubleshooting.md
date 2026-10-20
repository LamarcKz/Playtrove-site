---
id: troubleshooting
title: "Troubleshooting"
sidebar_position: 9
---

This guide covers Playtrove 0.7.0. Check your version in **Settings → About**.

## My library is empty

Add a folder in the **Emulators** tab and scan for games. This version does not import Steam, GOG or PC game folders. Check the emulator, console and, for RetroArch, the core selected for that folder.

See [getting started](getting-started.md).

## A game will not launch

Check that the ROM is still at its original path and that the emulator executable exists. Use **Choose… / Change…** in Emulators if the installation has moved. For RetroArch, check that the configured core is installed.

The emulator itself needs to be ready to run the game.

## Covers or information are missing

Check the keys in **Settings → Metadata**, your connection, and the game's name and platform. libretro-thumbnails needs no key, but it depends on finding a cover by the ROM's name.

Not every source has every piece of information. See [metadata](metadata.md).

## Achievements do not appear

Check your RetroAchievements username and key, and whether the emulator is connected to the same account. For RPCS3, confirm its executable and whether the game has already run in it to install trophies.

See [achievements](achievements.md).

## The application reported a recovered database

Read the recovery notice. The damaged file is preserved next to the database. If the issue continues, close the application and report what happened; do not publish your database or keys in an issue.

## Report a problem

Use **Settings → About → Report a problem**, or open an [issue](https://github.com/LamarcKz/Playtrove/issues/new/choose). Describe the steps, expected result and actual result. The application's report button fills in your version and Windows version.

For vulnerabilities, use the [private security channel](https://github.com/LamarcKz/Playtrove/security/advisories/new). Remove keys and personal paths from the information you share.
