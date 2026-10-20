---
id: metadata
title: "Metadata and images"
sidebar_position: 5
---

Playtrove combines three sources:

| Source | Content | Key required? |
| --- | --- | --- |
| libretro-thumbnails | ROM covers, matched by filename and console | No |
| IGDB | Description, genres, developer, publisher and release date | Yes |
| SteamGridDB | Background art and missing covers | Yes |

Covers are looked up on libretro-thumbnails first, then SteamGridDB and finally IGDB. Backgrounds come from SteamGridDB or, when unavailable there, IGDB.

## Configure the services

Open **Settings → Metadata**. The IGDB and SteamGridDB cards include instructions for creating free keys and a button that opens each service's website.

Enter the keys in the application and save. Playtrove checks them before storing them. Secret keys are protected by Windows and are not returned to the fields on screen. Do not publish them in issues.

## Download and update

Keep automatic downloads enabled for new games, or use the download button in settings. A game's **More** menu lets you update that game individually.

The queue handles one game at a time and displays progress in the top bar. A result that cannot be found does not erase existing metadata or images.

Matching depends on the game's name and platform. IGDB descriptions remain in English; genres are translated when the application knows the translation. Manually replacing a cover is not available in version 0.7.0.

See [troubleshooting](troubleshooting.md) for missing images or credential errors.
