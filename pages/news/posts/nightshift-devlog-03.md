---
title: "Devlog #03 - Race AI & Race Framework"
date: 2026-06-01
dateDisplay: 1 June 2026
readTime: 5 min read
tag: devlog
tagDisplay: Devlog
game: nightshift
image: /pages/news/posts/media/nightshift-thumb-03.png
imageFallback: /pages/games/nightshift/Banner.png
excerpt: The racer AI system and full race framework are in. Vehicle avoidance, pickup decisions, race state machine, checkpoint management, PreRace camera sequences, and more.
---

After the scope decision in May, the focus shifted to getting the core race experience fully playable end-to-end. This covers three weeks of work from 21st May to 1st June 2026.

## Racer AI

The AI system is built on top of the spline-following foundation from earlier in development, with two new layers added on top.

**Vehicle avoidance** — each AI racer detects nearby competitors and applies a lateral offset to steer around them. It's a lightweight system that avoids the overhead of full path replanning while keeping races from collapsing into a single-file train. Racers nudge around each other naturally through corners and on straights.

**Pickup usage** — AI pickup decisions run on a utility scoring system evaluated every 1-2 seconds per racer. Each pickup type is scored against the current race context:

- Race position
- Nearby threats
- Current vehicle health
- Corner curvature ahead

The highest-scoring pickup above a minimum threshold gets activated. Decisions are staggered between racers so you don't get every AI triggering an EMP at the same moment. It makes the field feel reactive without being predictable.

<video src="posts/media/checkpoint-editor.mp4" controls loop muted playsinline></video>

## Race Framework

The race framework is built as two `UWorldSubsystem`s that own their respective concerns cleanly.

**`URaceEventManager`** owns the race state machine with six phases:

```
Inactive → PreRace → Countdown → Racing → Finish → Results
```

Each transition broadcasts a delegate — `OnRacePreRaceStarted`, `OnRaceCountdownStarted`, `OnRaceRacingStarted`, `OnRaceFinishLineReached`, `OnRaceResultsStarted` — so any system that cares about race phase can subscribe without tight coupling to the manager itself.

Position tracking runs at 20hz across all participants. Race positions are resolved using checkpoint count as the primary sort key with spline distance as tiebreaker — so two racers on the same checkpoint are correctly ordered by how far along the segment they are. AI finish times are approximated from remaining spline distance and current velocity when the player crosses the line.

**`URaceCheckpointManager`** handles checkpoint ordering, wrong-way detection, and progressive checkpoint visibility. A few details worth noting:

- Wrong-way detection uses velocity dot product against the checkpoint's forward vector with a 0.5s debounce to avoid false positives when clipping a checkpoint at an angle
- Only the next two checkpoints ahead are visible at any time — keeps the screen clean
- Checkpoint state is tracked per-pawn independently, so AI and player never interfere with each other's progress

**`ARaceCheckpoint`** is a spawnable actor with a `UBoxComponent` trigger and a `UArrowComponent` that shows the valid travel direction in editor — makes it easy to author checkpoints correctly by eye without needing to check vectors manually.

<video src="posts/media/ai-avoidance.mp4" controls loop muted playsinline></video>

**`ARaceFinishLine`** fires an `OnFinishLineCrossed` delegate that feeds back into `URaceEventManager` to trigger the Finish phase.

## PreRace Camera Sequence & Countdown

The race flow is now fully sequenced:

```
PreRace camera shots → Countdown (3 / 2 / 1 / Go) → Racing
```

During the PreRace phase all vehicle inputs are locked and a series of cinematic camera cuts play around the start area — establishing the environment and building tension before the countdown. `URaceCountdownWidget` fires the countdown beats and broadcasts `OnCountdownComplete` to hand off to the Racing phase.

The PreRace system from the earlier prototype has been brought back properly and wired into the new state machine rather than sitting as a standalone test.

<video src="posts/media/race-framework-test.mp4" controls loop muted playsinline></video>

## Visual Effects & Rear View Mirror

Smoke, trail, and nitrous VFX from the earlier prototype have been migrated back in and implemented properly in the base vehicle class so every vehicle in the game gets them automatically.

A `SceneCaptureComponent2D` has been added to the player vehicle and wired to a render target on the HUD to drive a working rear view mirror. Small detail, big feel.

## Still To Do

- End of race logic
- Results screen
- Perk selection screen post-race

These are next up. Once they're in the core race loop will be fully playable from start to finish.

---

Next devlog will cover the results and perk selection screens, and the first end-to-end playable run of the tournament loop.
