# Wasteland Warden — native app shell (Capacitor)

The game itself lives in `../mockup/index.html` (single-file HTML5 canvas,
the same file the browser mock-up uses). This folder wraps it in a native
iOS/Android shell and swaps the simulated platform services for real ones.

## How the pieces fit

- The game routes every platform call through a `Bridge` object
  (search `NATIVE BRIDGE` in `../mockup/index.html`). In a browser the
  Bridge methods are simulations, so the mock-up keeps working unchanged.
- `src/native.js` overrides those Bridge methods with real services:
  AdMob (rewarded + interstitial, with UMP/ATT consent), RevenueCat
  (StoreKit / Google Billing), Game Center / Play Games leaderboard,
  native storage, haptics, and safe-area layout.
- `build.mjs` produces `www/` from the canonical game file, **stripping
  the DEV MODE block** (unlimited-resources testing) and bundling
  `native.js`. Pass `--keep-dev` for internal test builds.

## One-time setup (your side)

1. **Apple Developer Program** (£79/yr) — developer.apple.com
2. **Google Play Console** (£20 one-off) if shipping Android
3. **AdMob account** — create the app + one rewarded and one interstitial
   ad unit per platform; put the IDs in `src/native.js` (TODOs marked).
   Until then the Google *test* ad units are wired in — safe for TestFlight.
4. **RevenueCat account** (free tier) — connect App Store Connect / Play
   Console, create the products listed in `src/native.js`
   (`ww.gems.500` … `ww.forge.bundle`), define `noads` and `pass`
   entitlements, and paste the public API keys into `src/native.js`.
5. **Leaderboard** — in App Store Connect → Game Center, create a
   leaderboard with ID `wasteland_warden_stage` (integer, "furthest
   stage"). Same ID in Play Console → Play Games Services.
6. A **Mac with Xcode** — or no Mac at all: a CI service like Codemagic
   or GitHub Actions with a macOS runner can build/sign/upload.

## Build & run

```bash
cd app
npm install
npm run build              # writes www/ (add --keep-dev for test builds)
npx cap add ios            # first time only
npx cap add android        # first time only
npm run ios                # sync + open Xcode → run on device / archive
npm run android            # sync + open Android Studio
```

## Store-readiness checklist

- [ ] App icon (1024px master) + launch screen — not yet produced
- [ ] Ad unit IDs, RevenueCat keys, leaderboard ID (TODOs in `src/native.js`)
- [ ] App Privacy labels: ads → "Identifiers, Usage Data" (AdMob);
      purchases handled by Apple/Google (no card data touches the app)
- [ ] `NSUserTrackingUsageDescription` string in Info.plist (ATT prompt)
- [ ] Age rating questionnaire: fantasy violence → likely 12+
- [ ] Loot crate odds are displayed in-game (Workshop) — Apple 3.1.1 ✓
- [ ] "Restore Purchases" button exists in the Shop ✓
- [ ] Screenshots (6.7" + 6.1" iPhone, 12.9" iPad if targeting iPad)
- [ ] TestFlight internal build → external beta → submit

## What is intentionally NOT in this shell

- No analytics SDK yet (decide: none / Firebase / RevenueCat metrics only)
- No push notifications (energy-refill reminders are a common later add)
- No cloud save beyond native storage (iCloud KV is a small follow-up)
