---
id: troubleshooting
title: "Troubleshooting"
sidebar_position: 9
---

This guide covers Playtrove 1.0.0. Check your version in **Settings → About**.

## The application will not open

Playtrove needs **Microsoft Edge WebView2**, which comes with Windows 10 and 11. If it has been removed, run the installer from the [official release](https://github.com/LamarcKz/Playtrove/releases/latest) again: it installs WebView2 when it is missing. For the portable edition, which installs nothing, install the [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) from Microsoft's website.

If Windows displays **Windows protected your PC**, see [installation](installation.md#first-launch).

## My library is empty

Add a folder in the **Emulators** tab and scan for games. This version does not import Steam, GOG or PC game folders. Check the emulator, console and, for RetroArch, the core selected for that folder.

If you used the 0.7.x portable edition, move its `data` folder next to the new `Playtrove.exe` while the application is closed.

See [getting started](getting-started.md).

## A game will not launch

Check that the ROM is still at its original path and that the emulator executable exists. Use **Choose… / Change…** in Emulators if the installation has moved. For RetroArch, check that the configured core is installed.

The emulator itself needs to be ready to run the game.

## Covers or information are missing

Check the keys in **Settings → Metadata**, your connection, and the game's name and platform. libretro-thumbnails needs no key, but it depends on finding a cover by the ROM's name.

If a cover looks cropped, it is probably a scanned box from libretro-thumbnails in a different shape from the upright frame. With SteamGridDB configured, use **Settings → Metadata → Download again for all** to replace your existing covers with upright ones.

Not every source has every piece of information. See [metadata](metadata.md).

## Achievements do not appear

Check your RetroAchievements username and key, and whether the emulator is connected to the same account. For RPCS3, confirm its executable and whether the game has already run in it to install trophies.

See [achievements](achievements.md).

## The application reported a recovered database

Read the recovery notice. The damaged file is preserved next to the database. If the issue continues, close the application and report what happened; do not publish your database or keys in an issue.

## Report a problem

Use **Settings → About → Report a problem**, or open an [issue](https://github.com/LamarcKz/Playtrove/issues/new/choose). Describe the steps, expected result and actual result. The application's report button fills in your version and Windows version.

For vulnerabilities, use the [private security channel](https://github.com/LamarcKz/Playtrove/security/advisories/new). Remove keys and personal paths from the information you share.
