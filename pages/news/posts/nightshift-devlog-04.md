---
title: "Devlog #04 - Perk Draft Screen & First Playable Loop"
date: 2026-06-08
dateDisplay: 8 June 2026
readTime: 3 min read
tag: devlog
tagDisplay: Devlog
game: nightshift
image: /pages/games/nightshift/Banner.webp
imageFallback: /pages/games/nightshift/Banner.png
excerpt: The perk draft screen is in, the UI framework got a full recode, and Nightshift now has a fully playable loop from title screen to race and back.
---

Short but significant week. 5th to 8th June.

## UI Framework Recode

The entire UI framework was rebuilt from the ground up to be more consistent and efficient. All menu and in-game widgets now share a common base that handles focus management and input correctly - fixing some persistent edge cases that had been causing issues, including a bug where the back action button wasn't showing up in certain menus.

It's not glamorous work but it's the kind of thing that either causes headaches for the rest of development if you leave it, or saves you weeks of pain if you sort it early. It's sorted.

## Results Screen & Position Reveal

When you cross the finish line, the first thing you see is your finishing position rendered as big graffiti spray text front and centre on screen. It's punchy and immediate in a way a plain number readout wouldn't be.

![Player position reveal](posts/media/PlayerPosition.webp)

That fades out into the results screen, which lists every racer in finishing order with their final time. DNF entries are handled - any racer that didn't make it to the line shows as such rather than a ghost time at the bottom.

![Race results screen](posts/media/Results.webp)

The ordering logic had a subtle bug worth mentioning: finished AI racers were still having their spline distance updated after crossing the line, which could push them ahead of the player in the internal position tracking even after the race was over. This will be fixed soon.

## Perk Draft Screen

The perk draft screen is fully implemented. After each race, three perk cards are presented. Each card shows the perk name, rarity, icon, and current level. Hovering a card flips open the full description so you know exactly what you're picking before you commit.

![Perk draft screen](posts/media/perk-draft-screen.webp)

Selecting a perk saves it to the save game. If you already have that perk, it levels up. If it's new, it gets added at level 1. On the next race, all your unlocked perks are loaded from save and applied to the vehicle automatically - stats updated, icons shown on the HUD.

![Perks shown in HUD](posts/media/perk-in-hud.webp)

## First Playable Loop

This is the milestone worth noting. Nightshift now has a fully playable end-to-end loop:

**Title Screen → Garage Hub → Race → Results → Perk Draft → Garage Hub**

The full post-race flow works like this: cross the finish line → your finishing position animates in as graffiti spray text → that fades out into the race results screen → hit next and the perk draft screen appears → pick your perk → back to the hub with it applied and ready for the next race.

It's rough around the edges and placeholder assets are everywhere, but the loop is real. Everything from here builds on top of a functional foundation rather than a collection of isolated systems. That changes how development feels.

---

Next up: rank progression, elimination logic, and getting the tournament structure properly connected end-to-end.