---
id: data-updates
title: "Data, privacy and updates"
sidebar_position: 8
---

Your library, ratings and reviews stay in a local database. A Playtrove account is not required.

## Data locations

| Edition | Folder |
| --- | --- |
| Installed application | `%APPDATA%\Playtrove` |
| Portable | `data`, next to `Playtrove.exe`, with `portable.txt` present |

The database is named `playtrove.db`; images are kept in the same data area. Uninstalling the installed edition preserves the library.

Close the application before copying its data folder. To move a portable edition, keep its entire folder together. Windows-protected keys may need to be configured again on another computer or account.

## External connections

The application goes online to obtain metadata and images, query RetroAchievements when an account is configured, and check GitHub for new versions. Secret keys are protected by Windows and are not displayed again.

## Update the application

In **Settings → About**, use **Check for updates**. Automatic checking on startup is enabled by default and can be turned off.

In the installed edition, a new-version notification offers downloading and installation; the application closes and reopens. In the portable edition, the button opens the release page to download the new version.

Official downloads are available in [Releases](https://github.com/LamarcKz/Playtrove/releases). Read the release notes before updating.

The development edition uses a separate copy of the data; see [contributing](contributing.md).
