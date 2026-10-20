---
id: emulators
title: "Emulators and ROM folders"
sidebar_position: 3
---

Playtrove 0.7.1 integrates these emulators:

| Emulator | Platform |
| --- | --- |
| PCSX2 | PlayStation 2 |
| DuckStation | PlayStation |
| RetroArch | Multiple consoles, depending on the core |
| RPCS3 | PlayStation 3 |
| PPSSPP | PSP |
| Dolphin | GameCube and Wii |
| Azahar | Nintendo 3DS |

In wider windows, **Emulators** and **ROM folders** use two columns. When there is less width, one section sits below the other. Long paths can wrap and buttons adapt to the space. Resizing preserves fields you are filling in; emulator detection, game scanning and launching follow the procedures below.

## Configure the executable

The **Emulators** tab detects installations automatically. Use **Search again** to repeat detection for emulators that have not been found, or **Choose… / Change…** to select another executable.

Playtrove launches the emulator installed on your computer; it does not replace it.

## Add and scan folders

Each ROM folder has an emulator and console. RetroArch also requires an installed core. Suggestions come from the folder name, but check the fields before adding it.

Use **Scan** on one folder or **Scan all folders** to find new games. The same ROM path is not imported twice. Removing a folder from this list keeps its games in the library.

Accepted formats depend on the emulator or core. For RPCS3, scanning recognizes ISOs and extracted folders containing `PS3_GAME/USRDIR/EBOOT.BIN`.

## Launch a game

**Play** uses the emulator's own settings. RetroArch opens maximized in a window, preserving fullscreen when it is already configured. Closing Playtrove does not close the emulator.

For Azahar, session time continues until the emulator closes. Learn more about [playtime and statistics](statistics.md).
