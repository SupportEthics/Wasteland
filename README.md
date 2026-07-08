# Wasteland Warden

A **top-down wasteland auto-shooter** (Survivor.io-style) for iOS/Android — the player only moves, the weapons fire themselves. Free-to-play with hybrid monetization (rewarded ads + in-app purchases + season pass).

> *The survivor moves; the weapons and abilities do the visual work.*

## What's in this repo (concept phase)

| Path | Contents |
|---|---|
| [`docs/DIRECTION_BRIEF.md`](docs/DIRECTION_BRIEF.md) | **The canonical direction brief**: top-down auto-shooter format, animation budget, weapon families & evolutions, enemy roles, base hub rooms, prototype scope, data-driven architecture. |
| [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) | Game design v0.2 implementing the brief: run loop, launch weapons/enemies, base hub, full monetization map (ad placements + IAP catalog), KPIs. |
| [`docs/RESEARCH.md`](docs/RESEARCH.md) | Market research: genre revenue data, hybrid ads+IAP benchmarks, comparable titles (Survivor.io $500M+). |
| [`mockup/index.html`](mockup/index.html) | **Playable prototype** — a real 20-wave run: player HP and contact damage, XP scraps that level you into 1-of-3 upgrade drafts, weapon levels + Radium evolution, scaling waves with elites, killable bosses at waves 10 and 20, medkits, ad revive, ultimate, base hub, armory, workshop, shop; every ad/IAP touchpoint labelled. |
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
