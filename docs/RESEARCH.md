# Wasteland Warden — Market Research & Direction

*Research date: July 2026*

## 1. The question

We have a strong pixel-art identity (post-apocalyptic "Wasteland Warden" art: title screen, 4 survivor heroes, 5 mutant enemy types, isometric arena tileset) and three business requirements:

1. **Ads** as a revenue stream
2. **In-app purchases** as a revenue stream
3. A **commercially strong genre**

This document summarises the market data and the recommended direction.

## 2. What the market data says

### Genre revenue (global, mobile)

| Genre | Annual IAP revenue | Notes |
|---|---|---|
| Strategy | ~$17.5B | Highest revenue per install (only ~4% of downloads) |
| **RPG** | **~$16.8B** | Includes idle RPG, action RPG, squad RPG |
| Puzzle | ~$12.2B | Download-heavy, lower ARPU |
| Casino | ~$11.7B | Regulatory-heavy |

RPG/mid-core genres are where IAP monetization is strongest; IAP still accounts for over half of global mobile game revenue, and around 95% of total mobile *game* revenue when subscriptions are included.

### Hybrid monetization is the 2026 standard

- The winning model is **hybrid**: rewarded ads + IAP + (optionally) a season pass, not one or the other.
- **Rewarded video is ~62% of mobile ad revenue** with 45–60% player engagement — the highest-performing format by far.
- Rewarded video used at the right moments (revive, 2x rewards, free crate) can **lift IAP conversion by up to 6x** — ads act as a "taste" of premium value rather than cannibalising purchases.
- Interstitials + rewarded + banners together can generate **$1–3 ARPDAU** in free-to-play depending on geo/genre.
- Western markets (UK/US/EU) have the highest willingness to pay and lowest ad sensitivity — a good fit for an English-language pixel-art title.

### The survivor-like / action-roguelite breakout

- **Survivor.io** (Habby, 2022) — the defining mobile survivor-like — has passed **$500M in IAP alone**, peaked around **$500k/day**, and was the top-grossing hybrid-casual game of 2023 (~$182M that year). Revenue split: ~24% China, ~21% US, ~21% South Korea.
- It proved that the *Vampire Survivors* formula (auto-attack, one-thumb movement, escalating hordes, mid-run upgrade choices) works brilliantly on mobile **and** monetizes far beyond its premium PC inspiration via gear gacha + rewarded ads.
- The genre is exceptionally **UA-friendly**: gameplay reads instantly in a 15-second TikTok/short-form ad (Survivor.io was one of the first big TikTok-marketing success stories).
- Comparable post-apocalyptic survival titles (Last Day on Earth, Day R Survival, Whiteout Survival, Kingshot) confirm the theme has a large, durable audience — but base-builders and open-world survival are multi-year builds; the survivor-like is achievable by a small team.

## 3. Recommended direction

**Wasteland Warden: a post-apocalyptic action roguelite (survivor-like) for iOS/Android.**

Why this genre wins for us:

1. **Proven ceiling, small-team floor.** $500M+ genre leader, yet the core game is a single arena, one control stick, and escalating waves — the smallest buildable version is genuinely fun.
2. **Perfect fit for the existing art.** The isometric arena tileset *is* the battlefield; the 4 survivors are the playable hero roster; the 5 mutants are the enemy waves and bosses.
3. **Natural hybrid monetization.** The genre's loop produces organic, player-positive ad moments (revive, double rewards, free crate, reroll) and deep IAP sinks (gear, heroes, energy, battle pass) — see `GAME_DESIGN.md`.
4. **Marketable.** Pixel-art hordes + one-thumb gameplay = instantly legible short-form video ads, the cheapest UA channel available to an indie.

## 4. Recommended production stack

| | Recommendation | Why |
|---|---|---|
| Engine | **Godot 4** | Free/open-source, first-class 2D & pixel-art pipeline, exports iOS + Android, lightweight builds. AdMob and IAP supported via maintained plugins (`godot-admob`, `godot-google-play-billing` / StoreKit). |
| Alternative | Unity | Bigger asset store and LevelPlay/AppLovin MAX mediation SDKs are first-party; runtime fees/licensing less indie-friendly. |
| Ads | AdMob (start) → mediation (AppLovin MAX or LevelPlay) once scaled | Rewarded video first; interstitials sparingly; no banners in-game (breaks immersion, worst eCPM). |
| IAP | StoreKit 2 (iOS) + Google Play Billing (Android) via engine plugin | Standard consumables + non-consumables + subscription (battle pass). |
| Backend (later) | Optional — game is offline-first | Add cloud save + remote config (e.g. Firebase) before scaling UA. |

## 5. Sources

- [Adapty — Mobile Game Monetization Strategies and Models for 2026](https://adapty.io/blog/mobile-game-monetization/)
- [Audiencelab — Mobile Game Monetization: Balancing Ads and IAP in 2026](https://audiencelab.ai/blog/mobile-game-monetization-strategies)
- [Tekrevol — Mobile Game Revenue Statistics 2026](https://www.tekrevol.com/blogs/mobile-game-revenue-statistics/)
- [Tenjin — Ad Monetization Benchmark Report 2026](https://tenjin.com/blog/ad-mon-gaming-2026/)
- [Udonis — Top Mobile Game Monetization Trends for 2026](https://www.blog.udonis.co/mobile-marketing/mobile-games/mobile-game-monetization-trends)
- [Deconstructor of Fun — State of Mobile 2026](https://www.deconstructoroffun.com/blog/2026/2/2/state-of-mobile-2026)
- [WN Hub — Survivor.io IAP exceeds half a billion dollars](https://wnhub.io/news/finance/item-43301)
- [PocketGamer.biz — How innovation and iteration transformed Survivor.io](https://www.pocketgamer.biz/feature/79592/how-innovation-and-iteration-has-transformed-survivorio/)
- [Axios — Mobile hit Survivor.io blew up on TikTok](https://www.axios.com/2022/08/26/survivorio-habby-tiktok-ios-android)
- [Dataintelo — Idle Games Market Research Report](https://dataintelo.com/report/idle-games-market)
- [FoxData — Kingshot: survival strategy poised to dominate mobile](https://foxdata.com/en/blogs/kingshot-a-remastered-survival-strategy-game-poised-to-dominate-mobile-in-2025/)
