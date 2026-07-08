# Wasteland Warden — Survivor.io-Style Direction Brief

*Authored by the project owner. This is the canonical direction; `GAME_DESIGN.md` and the interactive mock-up implement it.*

---

## Core direction

Wasteland Warden should now be treated as a top-down or three-quarter top-down survivor arena game, similar in structure to Survivor.io.

The player controls movement only. Weapons and abilities fire automatically. The game should focus on enemy swarms, automatic attacks, upgrades, weapon merging/evolution, and short survival runs.

This makes the game much easier to animate and code than a side-view pixel action game with full walking, aiming, shooting, and weapon-specific animations.

## Best visual format

Use a small, readable top-down / three-quarter top-down wasteland arena style.

Recommended scale:

- Player: 48–64 px tall
- Normal enemies: 32–56 px
- Elite enemies: 64–96 px
- Bosses: 128–192 px
- Weapons: mostly inventory icons, projectile sprites, orbiting sprites, and VFX
- Arena tiles: cracked asphalt, dirt, oil stains, rubble, toxic puddles

The character does not need a fully animated shooting pose for every weapon. The survivor can simply move around while attacks fire automatically from the player, drones, orbiting weapons, or ground effects.

## Why this is easier

Avoid building the game around a side-view survivor holding different weapons. That would require custom animation for every weapon type: walking with pistol/shotgun/rifle, shooting animations, reloading animations, recoil poses, aim directions, death and hit animations.

For a Survivor.io-style game, most of that can be skipped. Instead, use:

- One simple survivor walk cycle
- One idle pose
- Hurt flash effect
- Death animation
- Separate weapon icons
- Separate projectile sprites
- Separate VFX effects
- Auto-targeting logic

This keeps the art pipeline much smaller and makes future weapons much easier to add.

## Player animation requirements

1. **Idle** — 2–4 frames, subtle breathing or stance movement
2. **Walk / Run** — 4–6 frames, readable from top-down or three-quarter view
3. **Hurt** — 1–2 frames, or just a white/red flash handled in code
4. **Death** — 4–6 frames, optional for prototype
5. **Level-up pose** — optional; can be replaced with a glow, shockwave, or UI effect

Code can fake extra life using: body bob while moving, dust puffs under feet, white flash when hit, red screen edge when low health, glow when upgraded, shockwave on level up, small recoil shake when firing.

## Enemy animation requirements

Normal infected / swarm enemies: walk or crawl 4 frames; attack optional; death 3–5 frames. Most basic enemies damage the player on contact, so they do not need a full attack animation. Enemy silhouettes should be very distinct so the player can read them quickly during heavy swarms.

Recommended enemy roles:

1. **Rabid mutant dog** — fast, low silhouette, rushes player
2. **Bloated infected** — slow and round, explodes or leaves toxic puddle on death
3. **Banshee infected** — tall thin silhouette, screams or fires cone/projectile attack
4. **Stalker** — fast, lean, angular; dodges or darts toward player
5. **Behemoth** — huge and slow, high health, knockback slam
6. **Overlord** — elite commander or boss; buffs nearby enemies or summons waves
7. **Small glowing mutant** — small target; green throat sac signals acid spit or ranged attack

## Weapons become auto-abilities

Weapons should be designed around automatic attack patterns instead of traditional manual shooting — each an ability with a clear behavior and upgrade path.

| Family | Behavior | Evolution path |
|---|---|---|
| Scrap pistol line | Auto-shoots nearest enemy | Burst pistol → hand cannon → **Radium Blaster** |
| Pipe / melee line | Swings in an arc around the player | Spiked pipe → electrified pipe → **Shock Maul** |
| Nail bat / orbit line | Spins around the player | Double bat → sawblade bat → chain flail → **Scrap Storm** |
| Molotov / fire line | Throws fire zones onto the ground | Napalm pool → burning field → **Flame Storm** |
| Drone line | Independent companion shoots nearby enemies | Gun drone → rocket drone → plasma drone → **Drone Swarm** |
| Toxic line | Leaves damage-over-time areas | Acid puddles → toxic grenade → radiation cloud → **Nuclear Sludge Field** |
| Lightning / spark line | Chains damage between enemies | Tesla arc → storm coil → **Wasteland Thunder Grid** |
| Heavy cannon line | Slow, powerful shots | Rail cannon → plasma cannon → **Fusion Cannon** |

## Merge / evolution structure

- Player collects XP scraps during the run.
- Level-up offers 3 random upgrade choices.
- Weapons can level up multiple times.
- Certain max-level weapons evolve when paired with the correct passive item.
- Evolved weapons should feel much stronger and more visually dramatic.

Example recipes:

- Scrap Pistol + Targeting Scope = **Radium Blaster**
- Pipe + Battery Pack = **Shock Maul**
- Molotov + Fuel Can = **Napalm Storm**
- Drone + Circuit Board = **War Drone Swarm**
- Nail Bat + Magnet Core = **Scrap Cyclone**
- Toxic Canister + Mutant Gland = **Nuclear Sludge Field**

## Core game loop

1. Player enters an arena.
2. Player moves with joystick, WASD, or touch drag.
3. Weapons fire automatically.
4. Enemies spawn in waves and move toward the player.
5. Defeated enemies drop XP scraps and pickups.
6. Player levels up and chooses 1 of 3 upgrades.
7. Weapons merge/evolve when upgrade requirements are met.
8. Mini-bosses and bosses spawn at timed intervals.
9. Player survives until timer ends or dies.
10. Player returns to base/hub to spend currency on permanent upgrades.

## Base / hub structure

The base does not need to be a fully explorable area at first — a visual menu hub between runs:

- **Armory** — weapon upgrades and weapon unlocks
- **Workshop** — merge recipes and crafting
- **Med Bay** — max health, healing, revive upgrades
- **Radio Tower** — missions, daily runs, map selection
- **Barracks** — survivor skins and character selection
- **Garage** — drones and tech companion upgrades
- **Generator** — permanent power/core upgrade tree
- **Gate** — start the next run

## First prototype scope

- 1 survivor, 1 arena, 3 enemy types, 5 weapons, 10–15 upgrades, 1 boss
- 5–10 minute survival timer, XP drops, level-up choices, basic weapon evolution

First enemy types: basic infected (slow swarm), rabid mutant dog (fast, low health), bloated infected (slow, explodes/toxic puddle).

First weapons: scrap pistol (shoots nearest), spinning blade/nail bat (orbits), molotov (fire puddles), turret drone (independent), shock field (pulses around player).

## Coding systems needed

Player movement · camera follow · enemy spawning · enemy movement toward player · contact damage · player health · projectile system · projectile pooling · auto-targeting nearest enemy · area damage zones · orbiting weapons · drone companion behavior · XP pickup drops · magnet pickup behavior · level-up UI · upgrade selection · weapon level tracking · weapon evolution/merge recipes · damage numbers · wave timer · boss spawning · run end screen · permanent upgrade currency.

Use simple collision circles for most objects. Avoid complex hitboxes in the prototype.

## Data-driven structure

Weapons, enemies, upgrades, and merge recipes should be data-driven rather than hard-coded.

- **Weapon**: id, displayName, icon, maxLevel, cooldown, damage, projectileSpeed, range, targetingType, attackPattern, requiredPassiveForEvolution, evolvedWeaponId
- **Enemy**: id, displayName, sprite, maxHealth, moveSpeed, contactDamage, xpValue, spawnWeight, behaviorType, deathEffect
- **Upgrade**: id, displayName, description, icon, type (weapon/passive/stat/evolution), targetWeaponId, effect, rarity
- **Merge recipe**: baseWeaponId, requiredWeaponLevel, requiredPassiveId, requiredPassiveLevel, evolvedWeaponId

## Art priorities

Highest priority: clear enemy silhouettes · satisfying projectile effects · weapon upgrade icons · XP drops and pickup effects · arena readability · level-up cards · big evolution VFX · boss warning UI · player skins · base hub art.

Lower priority: full manual shooting animations, reload animations, weapon-specific player poses, complex directional animations, fully explorable base interiors.

## Important design rule

**The player's body should not need to change animation for every weapon. The survivor moves; the weapons and abilities do the visual work.**

## Final recommendation

Wasteland Warden should be built as: **a top-down wasteland auto-shooter with modular survivor skins, automatic weapons, enemy swarms, drone companions, weapon merging/evolution, and a base upgrade hub.**

This direction keeps the gritty post-apocalyptic identity while making the animation and coding workload much more manageable.
