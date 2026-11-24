---
title: "I made a robot dance when the Penguins score"
date: 2026-11-23
entry: 1
summary: "A Stackchan robot, a live NHL score feed and a full-on goal celebration with lights, head banging and an announcement from the late, legendary announcer Mike Lange."
tags: [hardware, ai-tools]
draft: false
scoreboard:
  hours: 5
  shipped: 1
  broken: 2
  whatDoesThatMean: 2
---

"Scratch my back with a hacksaw!" in Mike Lange's voice belted out from my tiny little robot after Sidney Crosby buried a puck in the net.

<figure>
  <video controls playsinline preload="metadata" width="720" height="1280" poster="/images/vern-goal-dance-poster.jpg" aria-label="Vern the robot flashing a GOAL! screen for Sidney Crosby, playing a Mike Lange goal call and dancing">
    <source src="/videos/vern-goal-dance.mp4" type="video/mp4">
  </video>
  <figcaption>Vern celebrating a (staged) Crosby goal. Sound on!</figcaption>
</figure>

## What I built

Stackchan is a little open source robot you can reprogram to do all kinds of cool stuff. I'm gonna call mine Vern. My first idea was to make him a huge Pittsburgh Penguins fan. The plan was to make Vern light up, shake his head and say one of Mike Lange's famous sayings, like "Get in the fast lane, grandma, the bingo game is ready to roll!"

After hooking Vern up to my Mac with a double-sided USB-C cable, it was time to go to work with Claude Code. Claude Code will walk you through the reprogramming step by step, and it only takes about 30 minutes. Quick heads-up: I built on top of M5Stack's own firmware, so Vern's built-in voice assistant still works. The one thing you lose is M5Stack's phone app, which won't connect to a robot running your own build.

## The tech stack

- **The robot:** M5Stack StackChan (K151) with a CoreS3 controller
- **The builder:** Claude Code
- **The firmware:** M5Stack's own factory firmware (it's on GitHub) with my Penguins code added
  on top, so the robot's built-in voice assistant still works
- **The toolchain:** ESP-IDF, Espressif's official tools for building the firmware and flashing
  it onto the robot over USB
- **Goal detection:** the robot connects to Wi-Fi and checks the NHL's public score API on its
  own, no laptop or server in the middle. During a game it checks every 15 seconds, and when it
  sees a Penguins goal it waits 15 more seconds, then celebrates.
- **The goal calls:** five real Mike Lange clips, squished down with ffmpeg so they fit on the
  robot and sound good on its tiny speaker
- **A detour:** I started out with PlatformIO and the Arduino framework, got a face on the
  screen and a tap-to-wiggle, then switched to building on the factory firmware instead.

## What broke

- **Choppy, garbled goal-call audio**: The real Mike Lange clips sounded really choppy on the robot. The cause was the side lights, not the audio files: each step of a light fade added some stress to the system and starved audio playback. Fix: I switched the lights instantly during the first 5 seconds and brought the fades back for the dance after the audio. I also kept Vern from moving and grooving for 5 seconds (until the Mike Lange audio finishes), since the whirring motors can be loud. The dancing now kicks in at the 5 second mark and lasts until the 30 second mark.

- **Celebration would spoil a delayed TV stream**: The first time Vern celebrated a Penguins goal, it actually happened BEFORE I saw the goal! I realized the app I was watching on my TV was delayed by about 45 seconds, so Vern got a heads-up on the goal before it showed on my TV. I couldn't have Vern spoiling all the goals, so I gave him a 15 second delay, which seems to work out well since he checks the API every 15 seconds.

## Tips and resources

- Start from the manufacturer's firmware and add to it, rather than rebuilding the robot's features from scratch: [m5stack/StackChan on GitHub](https://github.com/m5stack/StackChan)
- The NHL API has no official docs; a community reference covers the schedule and live-game endpoints: [NHL API Reference (unofficial)](https://github.com/Zmalski/NHL-API-Reference)
- When audio sounds bad, test with everything else switched off before re-encoding the files; here the lights were the cause: [ffmpeg audio filters](https://ffmpeg.org/ffmpeg-filters.html)
- I used Muse to pull the audio clips from a video platform. It did a great job finding, snipping and delivering clean audio files of Mike Lange's announcements.

## What I learned

This was my first hardware project! I learned a lot about firmware in the process and will be making Vern do more cool stuff in the future. Stay tuned.
