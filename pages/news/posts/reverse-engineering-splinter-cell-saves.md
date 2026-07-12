---
title: "Reverse Engineering Splinter Cell's Save Format"
date: 2026-07-12
dateDisplay: 12 July 2026
readTime: 6 min read
tag: article
tagDisplay: Article
image: /pages/news/posts/media/SCE_Tool.webp
imageFallback: /pages/news/posts/media/SCE_Tool.webp
excerpt: How I found the difficulty and progress flags in Splinter Cell's profile format, and built an editor for them.
---

Splinter Cell (2002) stores each player profile in a file called `Config.ini`, tucked away in `Save\<ProfileName>\`. The name is a lie. Open it in a text editor and you get line noise. There are no sections, no keys, no values. It is a binary blob with an INI extension, and it has apparently been sitting there unexamined for twenty four years.

I've recently started playing the game with the [EnhancedSC](https://github.com/Joshhhuaaa/EnhancedSC) patch and  wanted to flip an existing profile to Elite difficulty with permadeath enabled without replaying the campaign. That turned into an afternoon of hex diffing, some wrong conclusions, and eventually a complete map of the format. Here is how it went.

## What the file actually is

The first look was not encouraging:

```
00000000  53 00 61 00 6d 00 42 00 6f 00 69 00 00 00 19 00  |S.a.m.B.o.i.....|
00000010  00 00 00 00 d4 e8 19 00 09 5f 12 77 0c e8 19 00  |........._.w....|
00000020  fc ff ff ff a0 07 00 00 58 17 1a 00 00 30 26 00  |........X....0&.|
```

The readable parts are UTF-16LE strings: the profile name, then a list of the campaign's internal map names. Everything between them is junk. And not random junk: the four byte values scattered through it are things like `0x0019e8d4` and `0x77125f09`, which are stack addresses and pointers into `ntdll` as they were mapped when the file was written.

That is uninitialised memory. The game allocates a fixed 2044 byte buffer, writes a handful of fields into it, and flushes the whole thing to disk without zeroing it first. Roughly ninety percent of every Splinter Cell profile on every hard drive in the world is a snapshot of whatever happened to be on the stack at the moment it was saved. It is a small, harmless information disclosure bug, and it makes diffing enormously more annoying, because most of the file changes between runs for reasons that have nothing to do with the game.

## Finding difficulty

You cannot find a field by staring at one file. You find it by controlling one variable at a time.

So: five profiles, created back to back, identical in every respect except the setting I cared about. Normal, Hard, Elite, Hard with permadeath, Elite with permadeath. (Elite and permadeath are not stock features, they come from [Enhanced SC](https://github.com/Joshhhuaaa/EnhancedSC), an excellent community patch.) Then diff all five and throw away every byte that does not behave like a setting.

One byte survived:

```
| Offset 0x68 | Profile                |
| ----------- | ---------------------- |
| 00 00 00 00 | Normal                 |
| 01 00 00 00 | Hard                   |
| 02 00 00 00 | Elite                  |
| 03 00 00 00 | Hard + Permadeath      |
| 04 00 00 00 | Elite + Permadeath     |
```

A single 32 bit enum, and permadeath is not a separate flag but folded into the same value. Everything else that differed between those five files was pointer churn.

The first attempt to edit it failed, incidentally, and failed instructively. I wrote `04` to `0x69` instead of `0x68`, one byte too far right, producing `0x00000400`. The game booted, loaded the profile, and displayed the difficulty as "unknown". It did not crash, it did not silently fall back to Normal, it told me the value was out of range. That is a game that range checks its inputs, and it is a better failure mode than most modern software manages.

![Unknown Difficulty](posts/media/unknown-difficulty.webp)

## Three wrong turns

The honest part of the writeup.

**Wrong turn one.** The file contains a list of level names, and some profiles listed twelve while others listed thirteen. Obviously that was the unlock list. It was not. A brand new profile with nothing played lists every map in the game. It is a static campaign table, identical in every profile from a given build, and the twelve versus thirteen difference is just from a patch adding the bonus mission. Writing names into it does nothing, as I discovered after shipping a build of the editor with a level unlock feature that unlocked no levels.

**Wrong turn two.** My fully unlocked reference profile was not one I had earned. It was called `SamBoi`, and it came from [a 2018 Steam discussion thread](https://steamcommunity.com/app/13560/discussions/0/3211505894123109746/) where players were passing around profiles so they could jump straight to the later missions. The `Config.ini` timestamp still read April 2018, which turned out to matter more than I realised: it had been written by the stock game, years before the community patch existed, so it was in a subtly different format to every other file I was comparing it against.

That was the useful half. The unhelpful half: I diffed `SamBoi` against a supposedly default profile and found the two were byte identical apart from the name. Astonishing. Progress could not possibly be stored in this file. Except that "default" profile was a copy of `SamBoi` that I had renamed previously during testing. I had diffed a file against itself and drawn a confident architectural conclusion from it. Contaminated sample, entirely self inflicted, and it burned several rounds before I caught it.

**Wrong turn three.** In the very first diff I spotted a small integer at `0x7D8` that differed between profiles, then talked myself out of it because of wrong turn two.

## Finding progress

The fix, as always, was a properly controlled experiment. One profile. Copy the file. Complete one mission. Copy it again. Diff.

478 bytes changed, because of course they did, but only one of them was a small integer rather than a pointer:

```
0x7D8:  00 00 00 00   ->   02 00 00 00
```

Two missions unlocked became three. `0x7D8` is the index of the furthest unlocked mission, so `0` is Training only and `11` unlocks the entire campaign. Set it, load the game, and mission select is fully populated.

## The format

```
0x000   profile name, UTF-16LE, null terminated
0x068   uint32  difficulty / permadeath enum, 0 to 4
0x2C4   13 slots of 0x64 bytes: static campaign map table, carries no progress
0x7D8   uint32  progress, index of furthest unlocked mission, 11 (0B) unlocks all
0x7F8   uint32  unidentified, changes on every write, apparently never validated
everything else  uninitialised stack memory
```

Two fields. Two useful fields in a 2044 byte file, and a 32 bit enum doing double duty for difficulty and permadeath. The rest is padding, garbage, and a table that may be useful for adding custom maps.

## The tool

Rather than make people count hex columns, there is now a profile editor: a single HTML file, no install, no upload, everything happens in the browser. Drag a `Config.ini` onto it and you get the profile name, a difficulty selector with permadeath as a modifier, and a progress gauge styled after the game's own light meter. It reads the raw fields back to you so you can see exactly what is being written, and it refuses to touch the uninitialised regions, because the game does not care what is in them and neither should an editor.

It also detects a profile with a corrupted difficulty value and offers to repair it, which is the sort of feature you only think to add after you have created one yourself.

![Splinter Cell Editor](posts/media/SCE_Tool.webp)

## What is still unknown

The dword at `0x7F8` changes on every write and does not match a CRC32 or a checksum of the preceding bytes. It might be a hash, it might be a timestamp, it might be four more bytes of stack. Whatever it is, the game does not validate it, since edited profiles load happily with the original value left in place.

## Why bother

Nothing here matters. It is a twenty four year old stealth game, and the community solved "unlocking everything" back in 2018 by passing `SamBoi` save around a Steam thread. That works fine and requires no hex editor. It just does not tell you *why* it works, and it leaves you stuck with someone else's profile name, someone else's difficulty, and no way to ask for anything the uploader did not happen to want.

But the appeal of poking at a format like this is not the outcome, it is that a shipped commercial product is a fossil record. The uninitialised buffer probably tells you someone wrote `fwrite(buffer, 1, sizeof(buffer), f)` without a `memset` and nobody caught it. The combined difficulty and permadeath enum tells you a modder added features to a structure they could not extend, so they overloaded a field that already existed. The static map table tells you the profile format was designed to hold a manifest and then progress got bolted on somewhere else entirely.

You can read the decisions out of the bytes. That is the fun part.

---

*The editor and the full format notes are on [Splinter Cell Profile Editor](/pages/sc1-profile-editor.html). Enhanced SC, which makes the modern game worth playing, is [here](https://github.com/Joshhhuaaa/EnhancedSC).*
