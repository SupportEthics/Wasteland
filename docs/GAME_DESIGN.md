# Wasteland Warden — Game Design (v0.2)

**Genre:** Top-down wasteland auto-shooter (Survivor.io-style) · **Platform:** iOS / Android, portrait · **Business model:** Free-to-play, hybrid (rewarded ads + IAP + season pass)

> v0.2 implements the owner's [`DIRECTION_BRIEF.md`](DIRECTION_BRIEF.md): player controls **movement only**, all weapons fire automatically, runs are short survival waves, and the meta lives in a base hub. The interactive mock-up at [`mockup/index.html`](../mockup/index.html) demonstrates every system below.

---

## 1. Fantasy & pitch

You are a **Warden** holding the line at the last outpost. Each run you step through the Gate into a ruined arena, survive escalating swarms for up to 10 minutes while your salvaged arsenal fires itself, and haul the scrap home to upgrade the base.

*"The survivor moves; the weapons do the visual work."*

## 2. Core run loop (5–10 min)

1. Enter arena (1 energy). One-thumb floating joystick moves the Warden; **everything fires automatically**.
2. Swarms spawn continuously from the arena edges and converge. Contact = damage (no enemy attack animations needed).
3. Kills drop **XP scrap** that magnets to the player. Bar full → **draft 1 of 3 upgrades** (new weapon, weapon level, or passive).
4. Max-level weapon + matching passive → **EVOLUTION** (dramatic gold card, big VFX, visibly stronger attack).
5. Mini-boss/boss at timed intervals. Survive the timer or die → results → base hub.

### Launch weapon set (mock-up demonstrates all five)

| Weapon | Behavior | Evolution (+ passive) |
|---|---|---|
| Scrap Pistol | auto-shoots nearest enemy | + Targeting Scope → **Radium Blaster** |
| Nail Bat | orbits the player | + Magnet Core → **Scrap Cyclone** |
| Molotov | throws fire zones | + Fuel Can → **Napalm Storm** |
| Turret Drone | independent companion fire | + Circuit Board → **War Drone Swarm** |
| Shock Field | pulses around player | + Battery Pack → **Shock Maul** |

Full 8-family roadmap (toxic, lightning chain, heavy cannon, melee arc) in the brief.

### Launch enemy roster (mapped to existing art)

| Role (brief) | Art | Behavior | Scale |
|---|---|---|---|
| Basic infected | Shambler | slow swarm filler | ~36 px |
| Stalker / rabid dog | Crawler | fast, low silhouette, darts in | ~28 px |
| Bloated infected | Sporewalker | slow; leaves toxic puddle on death | ~42 px |
| Banshee/ranged | Raider | lean, quicker, pressure from angles | ~40 px |
| Behemoth (boss) | Juggernaut | huge, slow, high HP | ~120 px |

Silhouette clarity > detail: each role reads at a glance in a 20+ enemy swarm.

### Animation budget (per brief)

- Survivor: 4-frame walk sheet + idle frame + code-driven hurt flash. **No weapon-specific poses ever.**
- Enemies: 4-frame walk/crawl sheet + code death poof. Contact damage, no attack anims.
- Juice from code: dust puffs, white hit-flash, red low-HP vignette, level-up shockwave, damage numbers, evolution VFX.
- Current sheets are generated from the single-frame art by `mockup/make_walk_sheets.py`; real production frames slot in later without code changes.

## 3. Base hub (between runs)

A visual menu hub, not an explorable area (v1):

| Room | Function | Monetization touchpoint |
|---|---|---|
| **Gate** | start next run | energy gate (ad refill) |
| **Armory** | weapon/gear upgrades, merge 3→1 rarity | coin/scrap sink |
| **Workshop** | supply crates + merge recipe book | keys/gems, 📺 free daily crate |
| **Med Bay** | max HP, healing, revive upgrades | coin sink |
| **Radio Tower** | daily missions, map select | 📺 rewarded bonuses |
| **Barracks** | survivor selection + skins | shards, cosmetic IAP |
| **Garage** | drone/companion upgrades | coin/gem sink |
| **Generator** | permanent core upgrade tree | long-term scrap sink |
| **Supply Post** | the shop | IAP |

## 4. Monetization map (unchanged from v0.1 — proven hybrid model)

### Rewarded ads (opt-in, capped)
| Placement | Reward | Cap |
|---|---|---|
| Revive on death | continue the run | 1/run |
| Results screen | **2× run rewards** | every run |
| Radio Tower daily crate | 1 Rusty Crate | 1/day |
| Energy refill | +1 energy | 2/day |
| Draft reroll | new set of 3 choices | 1/level-up |

### Interstitials
Only after results, only for non-payers, capped 1-per-3 runs, none in first sessions. Any IAP removes them permanently.

### IAP catalog
Gem packs £1.99/£7.99/£24.99 · **Remove Ads £7.99** · Starter Bundle £2.99 · Warden's Contract season pass £4.99/season · Crate keys ×10 £4.99. Gems → crates, extra revives, energy, cosmetics. Loot-box odds + pity displayed (platform compliance).

## 5. Data-driven architecture (per brief)

All content ships as data, not code:

- `weapons.json` — id, icon, maxLevel, cooldown, damage, projectileSpeed, range, targetingType, attackPattern, requiredPassiveForEvolution, evolvedWeaponId
- `enemies.json` — id, sprite, maxHealth, moveSpeed, contactDamage, xpValue, spawnWeight, behaviorType, deathEffect
- `upgrades.json` — id, type (weapon/passive/stat/evolution), targetWeaponId, effect, rarity
- `recipes.json` — baseWeaponId, requiredWeaponLevel, requiredPassiveId, requiredPassiveLevel, evolvedWeaponId

Engine systems: movement + camera follow, spawner (weights/waves), projectile pool, auto-targeting, area zones, orbiters, drone AI, XP magnet, draft UI, evolution resolver, damage numbers, wave timer, boss spawner, run summary, permanent-currency wallet. Simple collision circles everywhere.

## 6. Prototype scope (8–10 weeks, per brief)

1 survivor · 1 arena · 3 enemies (shambler, crawler, sporewalker) · 5 weapons (table above) · 10–15 upgrades · Juggernaut boss · 5–10 min timer · XP/draft/evolution · rewarded ads (revive + 2×) · gem IAP + Remove Ads.

## 7. KPIs at soft launch

D1/D7 retention ≥ 35%/12% · rewarded-ad engagement ≥ 45% of DAU · blended ARPDAU ≥ $0.15 before UA scale · median run 8–12 min, ≥2 runs/session.
