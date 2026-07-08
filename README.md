# Wasteland Warden

A post-apocalyptic **action roguelite (survivor-like)** for iOS/Android — free-to-play with hybrid monetization (rewarded ads + in-app purchases + season pass).

> *Vampire Survivors meets Mad Max: one thumb, ten minutes, a thousand mutants.*

## What's in this repo (concept phase)

| Path | Contents |
|---|---|
| [`docs/RESEARCH.md`](docs/RESEARCH.md) | Market research: genre revenue data, hybrid ads+IAP benchmarks, comparable titles (Survivor.io $500M+), and why this direction was chosen. |
| [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) | Game design v0.1: core loop, meta systems, full monetization map (ad placements + IAP catalog), MVP scope, KPIs. |
| [`mockup/index.html`](mockup/index.html) | **Interactive mock-up** — a clickable phone-framed prototype of every screen (title → lobby → battle → level-up draft → ad revive → results → gear → crates → shop → wardens), with every ad/IAP touchpoint labelled. |
| [`assets/art/`](assets/art) | Source pixel art: title screen, 4 survivor heroes, 5 enemy types (individual transparent sprites in `sprites/`), isometric arena. |

## Viewing the mock-up

Open `mockup/index.html` in any browser (it loads images from `mockup/assets/`, so serve or open from disk — no build step). Best viewed at phone size; on desktop it renders inside a phone frame.

To rebuild the single-file shareable version (images inlined as data URIs):

```
python3 mockup/build_artifact.py
```

## Planned production stack

- **Engine:** Godot 4 (2D/pixel-art pipeline, iOS + Android export)
- **Ads:** AdMob → mediation once scaled; rewarded-video-first design
- **IAP:** StoreKit 2 / Google Play Billing
- Offline-first single player; no backend required for MVP

See `docs/RESEARCH.md` §4 for the full rationale.
