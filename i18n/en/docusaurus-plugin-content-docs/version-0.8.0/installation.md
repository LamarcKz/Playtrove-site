---
id: installation
title: "Installation"
sidebar_position: 1
---

Playtrove 0.8.0 runs on **64-bit Windows 10 or 11**. Download the files from the [official release](https://github.com/LamarcKz/Playtrove/releases/tag/v0.8.0).

## Choose a format

| File | How to use it | Library location |
| --- | --- | --- |
| `Playtrove-Setup-0.8.0.exe` (about 5 MB) | Run the installer and follow its screens: welcome, install folder, installation and finish. It installs for your user without asking for administrator rights and creates a Start menu shortcut; the last screen also offers a desktop shortcut. | Your Windows user's application data folder. |
| `Playtrove-0.8.0-portable.zip` (about 7 MB) | Extract the entire ZIP into a new folder and open `Playtrove.exe`. Keep `portable.txt` next to the executable. | The `data` folder next to the executable. |

You do not need Node.js or programming tools to use the application.

## WebView2

Starting with 0.8.0, Playtrove's interface is displayed by **Microsoft Edge WebView2**, which comes with Windows 10 and 11, instead of a browser bundled with the application. That is why the downloads are much smaller.

If WebView2 is missing, the installer downloads and installs it, which requires an internet connection. The portable edition installs nothing: it uses the WebView2 already present in Windows.

## Coming from 0.7.x

In the installed edition, use the application's own update notification, or **Settings → About → Check for updates**, and choose **Update**. The application downloads the 0.8.0 installer, the previous version is removed, and the new one opens by itself with the library, settings and API keys you had already saved.

Running the 0.8.0 installer manually also removes the previous version before installing, without deleting the library.

For the portable edition, extract 0.8.0 into a new folder. To keep your library, close the old application and move its `data` folder next to the new `Playtrove.exe`.

## First launch

The 0.8.0 installer and executable are not code-signed yet. Windows may display **Windows protected your PC**. After checking that the file came from the official release, use **More info → Run anyway** to open it.

This Windows signature is different from update signing: Playtrove itself only installs a new version signed with the project's key.

Your library starts empty. The application does not include games or emulators. Continue with [Getting started](getting-started.md) to add your games.

See also [data and updates](data-updates.md).
