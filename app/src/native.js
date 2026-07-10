/* ============================================================
   NATIVE BRIDGE OVERRIDES — bundled into www/native.js by build.mjs
   and loaded after the game script in the Capacitor build only.

   Replaces the browser simulations on the game's `Bridge` object with:
     - Google AdMob rewarded + interstitial ads (with UMP consent)
     - StoreKit / Google Billing purchases via RevenueCat
     - Game Center / Google Play Games leaderboard
     - Native key-value storage (survives WebView data clearing)
     - Haptic feedback

   FILL IN BEFORE RELEASE (search for TODO):
     - AdMob app + ad unit IDs (use Google test IDs until then)
     - RevenueCat public API keys + product identifiers
     - Leaderboard ID from App Store Connect / Play Console
   ============================================================ */
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AdMob, RewardAdPluginEvents, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { CapacitorGameConnect as GameConnect } from '@openforge/capacitor-game-connect';

// TODO: replace Google's public TEST ad units with your real ones
const AD_UNITS = {
  rewarded: Capacitor.getPlatform() === 'ios'
    ? 'ca-app-pub-3940256099942544/1712485313'      // TODO ios rewarded
    : 'ca-app-pub-3940256099942544/5224354917',     // TODO android rewarded
  interstitial: Capacitor.getPlatform() === 'ios'
    ? 'ca-app-pub-3940256099942544/4411468910'      // TODO ios interstitial
    : 'ca-app-pub-3940256099942544/1033173712',     // TODO android interstitial
};
const REVENUECAT_KEY = Capacitor.getPlatform() === 'ios'
  ? 'appl_TODO_your_ios_key'                        // TODO
  : 'goog_TODO_your_android_key';                   // TODO
const LEADERBOARD_ID = 'wasteland_warden_stage';    // TODO: create in App Store Connect / Play Console

window.__NATIVE__ = true;
document.documentElement.classList.add('native');

(async () => {
  // --- ads: initialize with UMP consent (GDPR) + ATT on iOS ---
  await AdMob.initialize();
  try {
    const consent = await AdMob.requestConsentInfo();
    if (consent.isConsentFormAvailable && consent.status === 'REQUIRED') {
      await AdMob.showConsentForm();
    }
  } catch (e) { console.warn('consent flow', e); }

  // --- purchases ---
  try { await Purchases.configure({ apiKey: REVENUECAT_KEY }); }
  catch (e) { console.warn('revenuecat init', e); }

  // --- game services sign-in (silent; Bridge.lbLink retries loudly) ---
  try { await GameConnect.signIn(); } catch (e) { console.warn('game services', e); }
})();

/* ---------- storage (migrates any existing localStorage save) ---------- */
let kv = {};
(async () => {
  const { value } = await Preferences.get({ key: 'ww_save' });
  if (value && !localStorage.getItem('ww_save')) {
    localStorage.setItem('ww_save', value);          // hydrate for sync reads
    location.reload();                               // one-time: reload with the native save
  }
})();
Bridge.saveKV = (k, v) => {
  try { localStorage.setItem(k, v); } catch (e) {}
  Preferences.set({ key: k, value: v });             // durable copy
};
// loadKV stays synchronous via localStorage; Preferences hydrates it above.

/* ---------- rewarded ads ---------- */
Bridge.rewarded = async (onDone) => {
  let rewarded = false;
  const rewardSub = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { rewarded = true; });
  const dismissSub = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
    rewardSub.remove(); dismissSub.remove();
    if (rewarded) onDone();
    else toast('Ad closed early — no reward');
  });
  try {
    await AdMob.prepareRewardVideoAd({ adId: AD_UNITS.rewarded });
    await AdMob.showRewardVideoAd();
  } catch (e) {
    rewardSub.remove(); dismissSub.remove();
    toast('No ad available right now — reward granted anyway');
    onDone();                                        // never punish the player for fill problems
  }
};

/* ---------- interstitials (results screen only, capped by game logic) ---------- */
Bridge.interstitial = async (onDone) => {
  const sub = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => { sub.remove(); onDone(); });
  try {
    await AdMob.prepareInterstitial({ adId: AD_UNITS.interstitial });
    await AdMob.showInterstitial();
  } catch (e) { sub.remove(); onDone(); }            // no fill → just continue
};

/* ---------- purchases via RevenueCat ----------
   Product identifiers must match App Store Connect / Play Console.
   Suggested mapping (TODO create these products):
     gems500→ww.gems.500  gems2800→ww.gems.2800  gems12000→ww.gems.12000
     keys10→ww.keys.10    noads→ww.noads         starter→ww.starter
     pass→ww.pass.s1      forge→ww.forge.bundle                       */
const PRODUCT_IDS = {
  gems500: 'ww.gems.500', gems2800: 'ww.gems.2800', gems12000: 'ww.gems.12000',
  keys10: 'ww.keys.10', noads: 'ww.noads', starter: 'ww.starter',
  pass: 'ww.pass.s1', forge: 'ww.forge.bundle',
};
Bridge.purchase = async (id, onSuccess) => {
  try {
    const { products } = await Purchases.getProducts({ productIdentifiers: [PRODUCT_IDS[id]] });
    if (!products.length) { toast('Store product unavailable'); return; }
    await Purchases.purchaseStoreProduct({ product: products[0] });
    onSuccess();
    toast('Purchase complete — thank you, Warden');
  } catch (e) {
    if (!e.userCancelled) toast('Purchase failed — nothing was charged');
  }
};
Bridge.restorePurchases = async () => {
  try {
    const info = await Purchases.restorePurchases();
    const owned = info.customerInfo.entitlements.active;
    if (owned['noads']) { SAVE.noads = true; }        // map entitlements → save flags
    if (owned['pass']) { SAVE.pass = true; }
    save(); renderShop(); renderWallet();
    toast('Purchases restored');
  } catch (e) { toast('Restore failed — try again later'); }
};

/* ---------- leaderboard: Game Center / Play Games ---------- */
Bridge.lbSubmit = (stage) => {
  GameConnect.submitScore({ leaderboardID: LEADERBOARD_ID, totalScoreAmount: stage })
    .catch(e => console.warn('lb submit', e));
};
Bridge.lbLink = async () => {
  try { await GameConnect.signIn(); toast('Signed in to game services'); }
  catch (e) { toast('Sign-in unavailable'); }
};

/* ---------- haptics ---------- */
const IMPACT = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
Bridge.haptic = (kind) => { Haptics.impact({ style: IMPACT[kind] || ImpactStyle.Light }).catch(() => {}); };

/* ---------- native layout: honor the notch / home indicator ---------- */
const style = document.createElement('style');
style.textContent = `
  html.native .topbar{padding-top:calc(8px + env(safe-area-inset-top))}
  html.native #hud{padding-top:calc(10px + env(safe-area-inset-top))}
  html.native .navbar{padding-bottom:env(safe-area-inset-bottom)}
  html.native #dev-badge{display:none}
`;
document.head.appendChild(style);
