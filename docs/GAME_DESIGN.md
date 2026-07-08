# Wasteland Warden — Game Design (v0.1)

**Genre:** Post-apocalyptic action roguelite (survivor-like) · **Platform:** iOS / Android, portrait · **Business model:** Free-to-play, hybrid (rewarded ads + IAP + season pass)

An interactive mock-up of every screen described here lives at [`mockup/index.html`](../mockup/index.html).

---

## 1. Fantasy & pitch

You are a **Warden** — one of the last fighters holding the line between the settlements and the irradiated dead. Each run, you step into a ruined arena, hold off escalating hordes of mutants for 10 minutes, and haul the salvage home to forge better gear.

*"Vampire Survivors meets Mad Max, in 60 seconds of gameplay you already understand."*

## 2. Core loop (one run ≈ 8–12 min)

1. **Pick a Warden** (hero) and confirm loadout → spend 1 energy → enter the arena.
2. **Move with one thumb** (floating virtual joystick). Your Warden **auto-attacks** the nearest enemy.
3. **Hordes escalate in waves** — shamblers → crawlers (fast) → raiders (ranged) → sporewalkers (explode) → **Juggernaut boss** at the chapter's end.
4. Enemies drop **Scrap (XP)**. Filling the bar levels you up mid-run → **draft 1 of 3 skills** (Ricochet Blade, Molotov Ring, Drone Turret, Adrenaline, etc.). Builds emerge from stacking/evolving skills.
5. **Death or boss kill** ends the run → results screen → loot (coins, gear shards, crate keys) feeds the meta.

### Mid-run rules
- HP potions and supply drops appear on the map; movement is the whole skill.
- Skill drafts can be **rerolled once per level-up by watching a rewarded ad** (or with gems).
- On death: **one free revive per run via rewarded ad** (or gems). Second death is final.

## 3. Meta loop

| System | Description |
|---|---|
| **Chapters** | 30+ handcrafted chapters (arena variants, new enemy mixes, rising difficulty). Stars per chapter (clear / no-death / under-time). |
| **Wardens (heroes)** | 4 at launch — Ranger (bow, pierce), Brute (melee sweep, tanky), Scout (dual pistols, crit/speed), Medic (drones, sustain). Unlock via shards; level with coins. |
| **Gear** | 6 slots: Weapon, Armor, Boots, Gloves, Charm, Gasmask. Rarities Common→Legendary. **Merge 3 identical → next rarity.** Upgrade levels with coins + scrap. |
| **Supply crates** | Gacha: Rusty Crate (coins/common), Warden Cache (keys/gems, up to Legendary). Pity counter visible. One **free crate daily via rewarded ad**. |
| **Energy** | 1 run = 1 energy, max 5, refills 1/30 min. Refill via rewarded ad (2/day) or gems. Sets session cadence without hard-blocking payers. |
| **Daily missions & events** | "Kill 500 shamblers", "Clear Chapter 3 no-hit" → coins/keys. Weekend boss-rush event. |
| **Season pass** | 8-week "Warden's Contract": free track + premium track (£4.99). Cosmetic skins, gear, gems, exclusive banner. |

## 4. Monetization map

### Rewarded ads (player-positive, high engagement)
| Placement | Reward | Cap |
|---|---|---|
| Revive on death | Continue the run | 1/run |
| Results screen | **2× run rewards** | every run |
| Daily free crate | 1 Rusty Crate | 1/day |
| Energy refill | +1 energy | 2/day |
| Skill draft reroll | New set of 3 skills | 1/level-up |

### Interstitials (used sparingly)
- Only after the results screen, only for non-payers, never during gameplay, frequency-capped (e.g. 1 per 3 runs, none in the first 5 sessions). Any IAP permanently removes them.

### IAP catalog (launch)
| SKU | Price (GBP) | Type |
|---|---|---|
| Handful of Gems (500) | £1.99 | consumable |
| Sack of Gems (2,800) | £7.99 | consumable |
| Vault of Gems (12,000) | £24.99 | consumable |
| **Remove Ads** (interstitials gone; rewarded stays, buttons auto-grant) | £7.99 | non-consumable |
| Starter Bundle (gems + Rare weapon + 5 keys, one-time) | £2.99 | consumable |
| Warden's Contract (season pass) | £4.99 / season | subscription-like |
| Crate keys ×10 | £4.99 | consumable |

Gems spend on: crates/keys, revives beyond the free ad revive, energy, cosmetic skins.

### Why this mix works
Rewarded ads monetize the 95%+ who never pay, *teach* the value of boosts (lifting IAP conversion up to 6×), and "Remove Ads" converts ad-annoyance into a purchase. Gear/gacha + season pass give payers depth without pay-gating the core game.

## 5. Screens (see interactive mock-up)

1. **Title** — key art, tap to start.
2. **Home / Lobby** — selected Warden, chapter card, energy, currencies, bottom nav (Shop · Gear · Battle · Wardens · Events).
3. **Battle** — isometric arena, hordes, XP bar, timer, kill counter; level-up draft overlay.
4. **Death** — rewarded-ad revive vs. give up.
5. **Results** — loot list, claim ×2 (rewarded ad) vs. claim.
6. **Gear** — 6 slots + inventory grid, upgrade/merge.
7. **Crates** — two crate tiers, pity meter, free daily ad crate, opening reveal.
8. **Shop** — season pass, bundles, gem packs, Remove Ads, key packs.

## 6. Production notes

- **Engine:** Godot 4 (see `RESEARCH.md §4`). Offline-first single-player; no backend needed for MVP.
- **MVP scope (≈8–10 weeks for a small team):** 1 arena, 1 hero (Ranger), 3 enemy types + Juggernaut boss, 8 skills, 10 chapters, gear without merge, rewarded ads only (revive + 2×), gem IAP + Remove Ads.
- **v1.0:** all 4 heroes, 5 enemies, 30 chapters, merge, crates/pity, season pass, interstitials with caps, mediation.
- **Compliance:** COPPA/GDPR consent flow before ads; App Tracking Transparency prompt (iOS); loot-box odds disclosure (pity + % shown in-game) for platform policies.

## 7. KPIs to watch at soft launch

- D1/D7 retention ≥ 35%/12% (genre bar)
- Rewarded ad engagement ≥ 45% of DAU
- ARPDAU ≥ $0.15 blended before scaling UA
- Run length median 8–12 min; ≥ 2 runs/session
