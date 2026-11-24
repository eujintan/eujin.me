import type { PostHog } from 'posthog-js';

type Track = 'production' | 'engineering';
type Events = {
  $pageview: Record<string, never>;
  screen_viewed: { screen: 'discover' | 'likes' | 'profile' | 'messages' };
  project_impression: { project_id: string };
  project_swiped: { project_id: string; direction: 'left' | 'right'; input_method: 'keyboard' | 'button' | 'gesture' };
  swipe_undone: { project_id: string };
  deck_restarted: Record<string, never>;
  project_opened: { project_id: string };
  screenshot_browsed: { project_id: string; direction: 'next' | 'previous' };
  steam_clicked: { project_id: string };
  project_saved: { project_id: string };
  project_removed: { project_id: string };
  shortlist_share_requested: { count: number };
  resume_viewed: { track: Track };
  resume_download_clicked: { track: Track };
  contact_action: { method: 'email' | 'linkedin' | 'copy_draft' };
};
const key = import.meta.env.PUBLIC_POSTHOG_KEY;
const host = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const consentKey = 'eujin.analytics.consent.v1';
export type Consent = 'accepted' | 'declined' | null;
let consent: Consent = null;
let client: PostHog | undefined;
let pending: Promise<PostHog | undefined> | undefined;
export function available(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const hostname = window.location.hostname;
  const testMode = import.meta.env.PUBLIC_ANALYTICS_TEST;
  const isProductionHost =
    hostname === 'eujin.me' ||
    hostname === 'www.eujin.me';

  const enabled = Boolean(key) &&
    (isProductionHost || testMode === 'true');

  console.log('[Analytics] Availability', {
    keyConfigured: Boolean(key),
    host,
    hostname,
    testMode,
    testModeType: typeof testMode,
    isProductionHost,
    enabled
  });

  return enabled;
}
export function readConsent(): Consent { try { const value = localStorage.getItem(consentKey); return value === 'accepted' || value === 'declined' ? value : null; } catch { return null; } }
async function getClient() {
  if (!available() || consent !== 'accepted') return;
  if (client) return client;
  pending ??= import('posthog-js').then(({ default: posthog }) => {
    if (consent !== 'accepted') return undefined;
    posthog.init(key, { api_host: host, autocapture: false, capture_pageview: false, capture_pageleave: false, disable_session_recording: true, disable_surveys: true, advanced_disable_feature_flags: true, person_profiles: 'never', persistence: 'localStorage', capture_dead_clicks: false });
    client = posthog; return client;
  }).catch(() => undefined).finally(() => { pending = undefined; });
  return pending;
}
export function setConsent(value: Consent) {
  consent = value;
  try { if (value) localStorage.setItem(consentKey, value); else localStorage.removeItem(consentKey); } catch { }
  if (value !== 'accepted') client?.opt_out_capturing();
  else client?.opt_in_capturing({ captureEventName: false });
}
export function track<K extends keyof Events>(event: K, properties: Events[K]) {
  if (!available() || consent !== 'accepted') return;
  void getClient().then(ph => { if (consent === 'accepted' && ph) ph.capture(event, { ...properties }); }).catch(() => { });
}
