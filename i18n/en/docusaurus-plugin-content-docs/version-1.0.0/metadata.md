---
id: metadata
title: "Metadata and images"
sidebar_position: 5
---

Playtrove combines three sources:

| Source | Content | Key required? |
| --- | --- | --- |
| SteamGridDB | Upright covers, background art and the game logo | Yes |
| IGDB | Description, genres, developer, publisher, release date, covers and trailers | Yes |
| libretro-thumbnails | Scanned ROM boxes, matched by filename and console | No |

As in Playnite, covers come first from upright artwork that fits the 3:4 frame on screen: SteamGridDB, then IGDB and, as a last resort, the scanned box from libretro-thumbnails, which can be square or landscape and appears cropped at the edges. Without keys, only libretro-thumbnails is used. Backgrounds come from SteamGridDB or, when unavailable there, IGDB. The **logo** (the game's name artwork, with a transparent background) comes from SteamGridDB and appears in the [fullscreen](fullscreen.md) themes.

## Configure the services

Open **Settings → Metadata**. The IGDB and SteamGridDB cards include instructions for creating free keys and a button that opens each service's website.

Enter the keys in the application and save. Playtrove checks them before storing them. Secret keys are protected by Windows and are not returned to the fields on screen. Do not publish them in issues.

## Download and update

Keep automatic downloads enabled for new games, or use the **Download metadata** button in settings. A game's **More** menu lets you update that game individually.

Games that already have a cover only replace it when their metadata is downloaded again. To replace the covers of your whole library, use **Settings → Metadata → Download again for all**.

The queue handles one game at a time and displays progress in the top bar. A result that cannot be found does not erase existing metadata or images.

Matching depends on the game's name and platform. IGDB descriptions remain in English; genres are translated when the application knows the translation. Manually replacing a cover is not available in version 1.0.0.

## Automatic trailers and music

With IGDB configured, the queue also looks for a game **trailer** and keeps a local copy, up to 720p and 100 MB. It plays silently behind Details view and fullscreen. The first time, Playtrove prepares the tools it needs, about 58 MB, without installing anything in Windows.

**Theme music** can also be searched automatically for new games; the option is in **Settings → Metadata**, separate from the other metadata downloads. When the choice is uncertain, the candidates are kept, and **Review music** lets you listen and choose after the batch finishes.

A video or music track you choose yourself takes priority over the automatic ones. See [organize your library](library.md#background-video-and-theme-music).

See [troubleshooting](troubleshooting.md) for missing images or credential errors.
