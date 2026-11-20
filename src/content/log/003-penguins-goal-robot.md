---
title: "I built a robot that dances when the Penguins score"
date: 2026-12-13 # TODO: confirm publish date
entry: 3
summary: "A Stack-chan robot, a live NHL score feed and a little head-bob every time Pittsburgh lights the lamp."
tags: [hardware, ai-tools]
draft: true
scoreboard: # TODO: swap in your real numbers
  hours: 21
  shipped: 1
  broken: 8
  whatDoesThatMean: 26
---

<!--
OUTLINE. Chris fills every TODO in with his own words, then deletes this comment.
Format: what I built, the tech stack, what broke, tips and resources.
Tone: light, breezy, fun.
-->

TODO: The hook. The first real goal it caught: where you were, the score, what the robot did,
how loud you got. Then the one-line pitch: a goal horn, except it's a tiny robot and it dances.

## What I built

TODO: Introduce Stack-chan for people who've never seen one.

- TODO: What Stack-chan is: a little open-source desk robot with a screen for a face and two
  servos for a neck
- TODO: Which one you have (the M5Stack StackChan kit, K151, on a CoreS3), and how you got it
  (kit as-is? any assembly?) and roughly what it cost, if you want to share
- TODO: Why the Penguins. One or two lines of fandom.
- TODO: What happens on a goal:
  - The head pans and tilts (the "dance")
  - The face changes (TODO: which expression?)
  - It says something (TODO: what does it say?)

![TODO: photo or GIF of Stack-chan mid-dance](/images/placeholder.svg)
*TODO: caption*

## The tech stack

TODO: Keep it plain-English. The angle: you never opened VS Code or a terminal.

- **The robot:** M5Stack StackChan (K151) with a CoreS3 controller
- **The builder:** the Claude Code desktop app. TODO: how you worked with it (describing what
  you wanted, letting it run the builds and uploads, what it was like watching it work)
- **The toolchain:** PlatformIO, using the Arduino framework (whatever the Stack-chan example
  used). TODO: one line on what PlatformIO is, in your words
- **The library:** M5StackChan (StackChan-BSP), which brings along M5Unified and M5GFX for the
  screen, servos and the rest of the hardware
- **A small workaround:** the library needs a newer ESP32 core (arduino-esp32 3.x) than
  PlatformIO's official platform ships, so the project uses the community pioarduino platform.
  TODO: a sentence on whether that meant anything to you at the time (great "wait, what does
  that mean?" fodder)
- **Goal detection:** the robot connects to Wi-Fi and polls an NHL score API on its own, no
  laptop or server in the middle. TODO: how often it checks, and how it knows a goal happened
  (the Pittsburgh score went up since the last check?)

```ini
; From platformio.ini: the whole "recipe" for building the robot's code
[env:stackchan]
platform = https://github.com/pioarduino/platform-espressif32/releases/download/55.03.311/platform-espressif32.zip
board = m5stack-cores3
framework = arduino
lib_deps =
    m5stack/M5StackChan@1.1.1
```

TODO: One line explaining this file for non-technical readers, e.g. a shopping list that tells
PlatformIO which board, which tools and which libraries to grab.

## What broke

TODO: The faceplants. One short beat each. Some prompts if you need them:

- TODO: The first thing that didn't work
- TODO: Anything with Wi-Fi, the NHL API or getting the score data
- TODO: Did it ever dance at the wrong time (the other team scored? a disallowed goal?) or miss
  a goal?
- TODO: Did the API lag behind the TV, or the TV behind the API? Spoiler-robot problem?
- TODO: The dumbest bug, the one you'll laugh about later

> TODO: The one lesson worth remembering. Sticky-note material.

## Tips and resources

TODO: What you'd tell someone trying this. Some candidates to keep, cut or add to:

- TODO: Your best tip for working with Claude Code on a hardware project
- TODO: Whether you'd buy the same kit again
- TODO: Links that helped. Candidates to check before publishing:
  - The Stack-chan project on GitHub: https://github.com/stack-chan/stack-chan
  - The pioarduino platform: https://github.com/pioarduino/platform-espressif32
  - TODO: the NHL API docs or write-up you used
  - TODO: anything else

## What I learned

TODO: Wrap it up: what this build taught you, what you'd add next (more dance moves? goal
horn sound?), and a tease for entry #004.
