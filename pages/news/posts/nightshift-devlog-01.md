---
title: "Devlog #01 - The Three Cs, Perks, Art Style & Custom Vehicles"
date: 2025-12-07
dateDisplay: 7 December 2025
readTime: 6 min read
tag: devlog
tagDisplay: Devlog
game: nightshift
image: /pages/news/posts/media/nightshift-thumb-01.jpg
imageFallback: /pages/news/posts/media/nightshift-thumb-01.jpg
excerpt: From engine optimisation and the three Cs to the perk system, cel-shaded art style, custom vehicle import pipeline, and the start of AI research. October to December 2025.
---

After the pivot to a racing roguelite in October 2025, the focus shifted to rebuilding the project properly on a solid foundation. This covers everything from November through to early December.

## 13th November - Refreshing the Project

The first order of business was getting the engine and project in a clean, performant state before building anything serious on top of it. UE5.7 was built from source, and the project went through a full optimisation pass following some well-documented guides on stripping out unnecessary engine features.

[Daft Software Blog: Unreal Performance Maxxing](https://blog.daftsoftware.com/unreal-perf-maxing/#ok-so-how-much-faster-is-it)
[How to Increase Unreal Engine Performance and FPS](https://www.quodsoler.com/blog/achieving-more-than-1000-fps-in-an-unreal-engine-5-project)

**First test - DX11 Forward Shading (SM5):**

Disabling deferred rendering and switching to forward shading produced dramatic results. In a packaged build at native 1440p on an RTX 3060 the game was running at 600-900fps with almost nothing in the scene. A solid baseline.

![Optimised project - DX11 Forward Shading](posts/media/optimised-project.webp)
![Optimised project - FPS](posts/media/fps.jfif)

**Second test - DX12 with Hardware Ray Tracing:**

Forward shading meant no Mega Lights support, which would make lighting complex to manage at scale. The switch back to DX12 with HWRT enabled cost around 0.5ms of frame time but brought the frame rate down to 400-500fps at native 1440p - still well within budget. More importantly, it was tested on a Steam Deck and held around 300fps at native resolution.

![Optimised project - DX12 HWRT](posts/media/optimised-project-2.webp)

![Running on Steam Deck](posts/media/optimised-project-steamdeck.webp)

The trade-off is worth it. HWRT-powered Mega Lights removes a significant amount of manual lighting optimisation work and gives much better results in a dynamic city environment.

## 16th-19th November - The Three Cs

With the engine sorted, work started on the three foundational pillars of any vehicle game: **Character** (the car), **Camera**, and **Controls**.

**Car** was already in decent shape from the prototype work. The focus here was making sure the vehicle configuration could be updated at runtime while driving - a requirement for the perk system to work correctly. Granting or removing a perk needs to immediately and correctly affect the vehicle without any restart.

**Camera** moved to a state tree-based system. The camera now dynamically adjusts FOV and boom offset at high speeds, and applies directional kicks and shakes during hard acceleration and cornering. It makes the car feel much faster without changing the actual physics.

**Controls** are currently handled by UE5's built-in Chaos Vehicle simulation which is solid enough for now, but work is planned to add more low-level control over drifting behaviour.

Alongside this, the **Gameplay Ability System** was set up with a vehicle attribute set. Perks operate as multipliers against these base attributes - speed, handling, acceleration, drift angle, and so on. Most perks won't directly set values, they'll adjust the multipliers, keeping the system composable and predictable.

## 17th-25th November - The Perk System

The perk system came together across the second half of November.

The perk selection screen presents three random perks after each race. Each perk has a rarity tier - Common, Uncommon, Rare, Legendary - which affects both its spawn weight and the visual treatment it gets on the selection screen. Rarer perks have a shine effect on their card and a distinct colour per tier.

The selection screen animates the reveal of the three options, building a small moment of anticipation before the player chooses. From there the perk is applied immediately through the attribute system and is reflected on the HUD with the correct icon, colour, and level indicator.

Triggerable ability perks were also added alongside the passive stat modifiers - abilities the player can activate mid-race as a one-time or cooldown-based effect.

## 26th November - Cel-Shaded Art Style

This was a significant day. A proper cel-shaded master material was established for the game - the look that Nightshift will ship with.

The material uses **halftone patterns in shadow regions** to give a printed/comic feel to dark areas, and retains the **stylised window shader** from earlier in development. The post process volume was also tuned to complement it - higher saturation, reduced blue colour correction, adjusted brightness and contrast to make the cel-shading pop without looking flat.

![Cel-shaded style - EA69](posts/media/celshaded-style.webp)

![Cel-shaded style - night lighting](posts/media/celshaded-style-2.webp)

The EA69 is the first custom vehicle imported into the project using the new rigging pipeline - more on that below.

<video src="posts/media/art-style-test.mp4" controls loop muted playsinline></video>

## 29th November - Custom Vehicle Import Pipeline

Getting custom vehicles into a UE5 Chaos Vehicle project has a non-trivial rigging requirement. The skeleton needs specific bones for wheels, axles, and dampers in the right hierarchy and orientation. Doing this manually for every vehicle is slow and error-prone.

A **Blender plugin** was built to automate this. Given the wheel locations in the scene, the plugin generates the full skeleton automatically - either using explicitly placed axle and damper locators, or calculating their positions from the wheel locations alone. The result is an FBX-ready rig that imports cleanly into UE5 every time.

The first vehicle through the pipeline was the **Toyaru EA69**. It's in-engine, rigged, physics-ready, and wearing the cel-shaded master material.

## 30th November - Ultra Dynamic Sky & Weather

Ultra Dynamic Sky was integrated and tested with different weather conditions. The vehicle master material was extended so that the car leaves **wheel marks in snow and dust** depending on the surface. Rain and snow interaction with the vehicle material is still in progress.

<video src="posts/media/uds-test.mp4" controls loop muted playsinline></video>

## 7th December - Racer AI Research

Work has started on planning the AI racing system. The current thinking is a hybrid approach - spline-following for route adherence combined with machine learning for realistic opponent behaviour. Several papers on ML for racing game AI were reviewed this week. Implementation will follow.

---

Next devlog will cover the AI system build, continued perk work, and progress on the city generation pipeline.
