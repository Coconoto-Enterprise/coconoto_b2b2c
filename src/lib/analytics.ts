/**
 * Microsoft Clarity — heatmaps and session recordings.
 *
 * **Inert unless `VITE_CLARITY_ID` is set at build time.** No script, no cookie,
 * no network request until an owner creates a Clarity project and pastes its
 * id into the environment, so this file changes nothing about the live site
 * today.
 *
 * Two problems this exists to solve:
 *
 * 1. **This is a single-page app.** Clarity keys heatmaps and recordings by URL,
 *    but every route here is the same document, so without an explicit page id
 *    every click on the site would be attributed to "/". Clarity's documented
 *    answer is the Identify API's `custom-page-id`, which has to be re-sent on
 *    every route change ("for optimal user tracking, the Identify API should be
 *    called for each page of the website").
 *
 * 2. **Some routes must never be recorded.** A recording is a video of the DOM.
 *    The dashboards render other people's names, emails, orders and enquiry
 *    messages into table cells — masking input boxes (Clarity's default) does
 *    not cover text. Those routes are therefore excluded from both the pageview
 *    call and the initial load.
 *
 * Known gap, deliberately documented rather than papered over: Clarity has no
 * "stop recording" API, so a session that starts on a public page and then
 * navigates into a dashboard keeps recording that dashboard. Closing that
 * properly means stamping `data-clarity-mask="true"` on the dashboard roots
 * before this is switched on.
 */

type ClarityFn = ((...args: unknown[]) => unknown) & { q?: unknown[][] };

const CLARITY_ID = String(
  (import.meta.env as Record<string, string | undefined>).VITE_CLARITY_ID ?? '',
).trim();

/** True when a Clarity project id was baked into this build. */
export const analyticsEnabled = CLARITY_ID.length > 0;

/**
 * Routes where a recording would capture somebody else's personal data.
 * Prefix match, so `/buyer-dashboard/orders` is covered too.
 */
const EXCLUDED_PREFIXES = [
  '/vintage-dashboard', // owner console — every customer enquiry
  '/tweetit-dashboard', // email centre — recipients and message bodies
  '/vendor-dashboard',
  '/buyer-dashboard',
  '/seller-dashboard',
  '/blog-editor', // unpublished drafts
];

/** Whether this path may be measured at all. */
export function isTrackable(pathname: string): boolean {
  if (!analyticsEnabled) return false;
  return !EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

let started = false;

/**
 * A per-tab id, not a per-visitor one.
 *
 * `identify()` requires a `custom-id`, and its whole point is stitching a person
 * across devices — which is more tracking than a heatmap needs. A value that
 * dies with the tab is enough to group one browsing session's routes together
 * without introducing a new persistent identifier of our own.
 */
const SESSION_KEY = 'coconoto_analytics_session';

function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // Private mode with storage disabled — Clarity can still record, we just
    // lose the grouping.
    return 'anonymous';
  }
}

/**
 * Installs the Clarity command queue immediately, but defers the 40 kB script
 * until the browser is idle. Nothing in the first paint depends on it, and the
 * queue means any `identify`/`set` call made before the script lands is replayed
 * in order rather than dropped.
 */
export function initAnalytics(): void {
  if (started || !analyticsEnabled) return;
  started = true;

  const w = window as Window & { clarity?: ClarityFn };
  if (!w.clarity) {
    w.clarity = function clarityQueue(...args: unknown[]) {
      const queue = w.clarity?.q ?? [];
      queue.push(args);
      if (w.clarity) w.clarity.q = queue;
    } as ClarityFn;
  }

  const load = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(script);
  };

  const idle = (window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
  }).requestIdleCallback;

  if (typeof idle === 'function') {
    idle(load, { timeout: 3000 });
  } else {
    window.setTimeout(load, 1200);
  }
}

/** Report a route to Clarity. Safe to call before the script has loaded. */
export function trackPageView(pathname: string): void {
  if (!isTrackable(pathname)) return;
  const clarity = (window as Window & { clarity?: ClarityFn }).clarity;
  if (!clarity) return;

  const id = sessionId();
  clarity('identify', id, id, pathname, document.title || pathname);
  // Also as a filterable tag, so the dashboard can group by page even if the
  // page id is not surfaced in the heatmap picker.
  clarity('set', 'page', pathname);
}

/** Fire a named event, e.g. a marketplace order. No-op when disabled. */
export function trackEvent(name: string): void {
  if (!analyticsEnabled) return;
  const clarity = (window as Window & { clarity?: ClarityFn }).clarity;
  if (!clarity) return;
  clarity('event', name);
}
