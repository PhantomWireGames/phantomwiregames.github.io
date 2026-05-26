---
title: "Devlog #00 - Initial Prototyping"
date: 2025-10-12
dateDisplay: 12 October 2025
readTime: 5 min read
tag: devlog
tagDisplay: Devlog
game: nightshift
image: /pages/news/posts/media/nightshift-thumb-00.png
imageFallback: /pages/news/posts/media/nightshift-thumb-00.png
excerpt: Where the game started from and how the idea came along. Chaos Vehicles, art style exploration, the original Crazy Taxi concept, and the pivot to a racing roguelite.
---

Nightshift didn't start as a racing roguelite. It started as something else entirely - and went through a full identity change before it became what it is today. This is the story of where it came from.

## September 2024 - The Vehicle Template

It started with UE5's built-in vehicle template and a simple question: how far can Chaos Vehicles actually go?

The first few weeks were pure experimentation. Getting a car to drive was easy. Getting it to *feel* right was not. Chaos Vehicle physics has a lot of surface area - suspension travel, tyre friction curves, differential configs, centre of mass. Every change had knock-on effects. It took a while to get something that felt like a real vehicle rather than a block sliding around a surface.

<video src="posts/media/car-test-01.mp4" controls loop muted playsinline></video>

The original game idea during this period was a Crazy Taxi-style experience. You'd spawn into a procedurally generated city at night. You'd have until sunrise to act as a getaway driver for criminals - pick up passengers, escape police chases, avoid detection, and get them to their destination before dawn. The tension came from the clock, the city, and the heat on your tail. That's also where the name **Nightshift** came from.

## Art Style - Finding the Look

Alongside the vehicle work, a lot of time went into figuring out what the game should *look* like. The reference points were NFS Underground, Tokyo Xtreme Racer, Initial D - games with a strong visual identity rooted in that era of street racing.

Several post-processing approaches were tested before landing on a direction. The most promising was a cel-shaded look using the **reverse hull technique** - the same approach used in Guilty Gear Strive for its hand-drawn outline effect. You render a slightly inflated inverted mesh with backfaces only, coloured black, giving the appearance of bold cartoon outlines without any post-process edge detection.

The glass shader was developed around the same time - a two-layer setup that simulates depth and reflectivity without being expensive. A version of that shader is still in use now.

<video src="posts/media/window-shader-test.mp4" controls loop muted playsinline></video>

<iframe src="https://blueprintue.com/render/fs6bgvfa/" scrolling="no" allowfullscreen style="width:100%;height:600px;border:none;display:block;margin:32px 0;background:var(--pw-dark-2);"></iframe>

The NSX was used as a test bed for the shaders and overall look during this period.

<video src="posts/media/nsx.mp4" autoplay loop muted playsinline></video>

## Vehicle Materials - No Textures Needed

One of the bigger early wins was the vehicle master material setup. Rather than relying on textures for vehicle paint - which takes up storage and needs a new texture per colour variant - the system uses a **second UV channel** mapped to flat colour regions across the vehicle body.

This means you can drive full paint customisation (base colour, metallic finish, tint) entirely through material parameters. No texture authoring per variant. Cheaper, cleaner, and more flexible.

<video src="posts/media/master-material.mp4" controls loop muted playsinline></video>

## First Systems - Nitrous, AI, Race Events

With the vehicle feeling solid and the visual direction clearer, work started on actual gameplay systems.

**Nitrous** was one of the first - a simple boost mechanic that's since evolved into a collectible in-race pickup rather than a persistent ability.

<video src="posts/media/nitrous.mp4" controls loop muted playsinline></video>

**NPC racer AI** came next. The first pass was rough - basic path following with no real awareness. It was enough to test the feel of racing against other cars, but the code was always going to be rebuilt properly. That work is ongoing.

<video src="posts/media/ai-test.mp4" controls loop muted playsinline></video>

**Race events** followed - time trials first, then point-to-point sprints. Proper race logic, start/finish detection, position tracking.

<video src="posts/media/time-trial.mp4" controls loop muted playsinline></video>

A cinematic camera sequence for race starts was also prototyped around this time.

<video src="posts/media/cinematic-shots.mp4" controls loop muted playsinline></video>

## Main Menu, Splitscreen & More Systems

While core vehicle and race systems were being built out, several other areas got prototyped in parallel.

**Main menu** - a dynamic camera system was built that smoothly cuts between cinematic angles of the car in a garage environment. No static screens - the menu lives in the world with the vehicle front and centre.

**Splitscreen** - local multiplayer support was prototyped early to understand the rendering cost and layout requirements. Both horizontal and vertical splits were tested.

<video src="posts/media/menu-test.mp4" controls loop muted playsinline></video>

**Vehicle damage & deformation** - a damage system was built using lattices and vertex colours to drive real-time mesh deformation on impact. Panels crumple, bodywork distorts, and the visual damage accumulates across a race. No texture swaps - actual geometry deformation driven by collision data.

<video src="posts/media/damage-deformation.mp4" controls loop muted playsinline></video>

**Runtime PCG road networks & traffic** - a procedural road network system was prototyped using UE5's PCG framework, generating road layouts and splines at runtime. Traffic was then spawned and managed along those splines using a basic flow system. This was an early look at what the city generation pipeline would eventually need to handle.

<video src="posts/media/pcg-roads-traffic.mp4" controls loop muted playsinline></video>

## August 2025 - UE5.4 to UE5.6

Before the pivot, an engine upgrade was done - UE5.4 to UE5.6. This was a good forcing function to refactor a lot of the early Blueprint code that had accumulated technical debt. A significant chunk was moved to C++, cleaned up, and structured properly. The codebase is in a much better state for it.

## October 2025 - The Pivot

By late 2025 it was clear the Crazy Taxi direction wasn't clicking. The open-world getaway concept had interesting ideas but the core loop wasn't tight enough - too much time spent navigating, not enough time doing anything interesting.

The pivot was to strip it back to the thing that was actually fun in playtesting: the racing itself. From there, roguelite structure was introduced - elimination tournament, perk drafts between races, procedural route assembly. A focused linear experience rather than an open world.

The name Nightshift stayed. The game became something much more defined.


---

The next devlog covers where Nightshift is now - the core loop, how the roguelite structure came together, and what the actual game looks like heading into active development.