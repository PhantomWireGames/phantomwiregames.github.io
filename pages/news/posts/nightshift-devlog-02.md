---
title: "Devlog #02 - PCG Roads, City Generation & A Pivot on Scope"
date: 2026-05-08
dateDisplay: 8 May 2026
readTime: 4 min read
tag: devlog
tagDisplay: Devlog
game: nightshift
image: /pages/news/posts/media/nightshift-thumb-02.jpg
imageFallback: /pages/news/posts/media/nightshift-thumb-02.jpg
excerpt: Road network PCG, a break, city generation stress tests, and a major scope decision - from December 2025 through to May 2026.
---

This one covers a longer stretch than usual. There was a break in the middle, and a significant design decision at the end of it.

## 8th December 2025 - PCG Road Network

The first proper PCG work went in. A graph that generates a road network across the city and plots a continuous race spline from one side to the other. This spline was intended to be the primary path the racer AI would follow - a backbone the rest of the route generation could branch off from.

<video src="posts/media/road-pcg-test.mp4" controls loop muted playsinline></video>

It worked as a proof of concept. The spline generated cleanly, road widths were consistent, and the network connected properly end-to-end. The AI following question was still open, but the foundation was there.

## December 2025 - March 2026 - The Break

Burnout hit. The project was shelved for a few months.

This wasn't a bad thing in hindsight. The time away was spent deliberately - going deep on UE5 C++ and UMG/Slate rather than pushing through on a project that wasn't going anywhere productive. Coming back with cleaner engineering instincts made a real difference to how the next phase was approached.

## March - May 2026 - City Generation & Scope Decision

Returning to the project, the goal was to properly stress test the full PCG city generation pipeline and understand its real performance characteristics before committing to building the whole game around it.

The results were not acceptable.

<video src="posts/media/city-gen-test.mp4" controls loop muted playsinline></video>

Frame rate impact and level streaming load times under full city generation were outside the acceptable range for the kind of experience Nightshift needs to be - fast, responsive, and consistent. The PCG pipeline was also genuinely complex to work with at scale, creating friction that would compound as more systems were added on top of it.

The test below shows the runtime PCG generation system under load:

<video src="posts/media/pcg-runtime-test.mp4" controls loop muted playsinline></video>

**The decision: no open-world city.**

Nightshift will use **linear, procedurally assembled race routes** instead. Hand-crafted route segments are assembled into full races at runtime - no streaming, no open world overhead, no PCG city generation during gameplay. The city as a backdrop exists, but the race routes are linear. This is closer to how games like F-Zero or Trackmania handle it, and it's a much better fit for a roguelite structure where each run needs to feel snappy and load instantly.

The PCG work is shelved for now. It will be revisited once the core gameplay systems are solid - there's still a version of it that makes sense for generating the world that exists outside the race routes, just not as the foundation of the gameplay loop itself.

## Mass Traffic - Ruled Out

UE5's Mass Traffic system was tested as a potential solution for ambient vehicles in the city. The integration overhead and complexity of getting it working alongside Chaos Vehicles and the custom race systems made it more trouble than it's worth at this stage.

A **custom traffic pooling and spawning system** will be built instead - simpler, fully controlled, and designed around what Nightshift actually needs rather than a general-purpose solution.

## Back to the GDD

With the scope decision made, time went back into the GDD to rework the core design around linear race events. The fundamental loop is unchanged - elimination tournament, perk draft, rival bosses - but the technical architecture underneath it is now built on a much more realistic foundation.

The next devlog covers getting back into active development with the new direction locked in.
