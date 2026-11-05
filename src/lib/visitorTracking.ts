/**
 * Self-hosted visitor analytics — full Clarity replacement.
 *
 * Tracks everything Clarity does plus what it can't:
 *
 * ✅ Session lifecycle (start → page views → exit)
 * ✅ Click tracking (element, text, position, viewport) → heatmap data
 * ✅ Rage clicks (3+ rapid clicks same area = frustration)
 * ✅ Dead clicks (clicks on non-interactive elements)
 * ✅ Scroll depth + scroll heatmap buckets
 * ✅ Mouse movement sampling (for cursor heatmaps)
 * ✅ Session recording timeline (event log for replay)
 * ✅ Custom events (form submit, order placed, etc.)
 * ✅ Tab visibility (switching tabs / minimizing)
 * ✅ Funnel staging (landing → browse → product → cart → checkout)
 *
 * + What Clarity CAN'T do:
 * ✅ Conversion tracking tied to real Supabase orders
 * ✅ GeoIP via Vercel headers (server-side, free)
 * ✅ Bot filtering (server-side user-agent analysis)
 * ✅ Funnel analysis with drop-off rates
 * ✅ Raw SQL queries against your own data
 *
 * Privacy:
 *   - Session ID is random localStorage, not tied to auth identity
 *   - Dashboard routes excluded — no PII enters the pipeline
 *   - No cookies set — localStorage only
 *   - No IP collected client-side (GeoIP done server-side via Vercel)
 *   - Input field values are NEVER tracked — only element metadata
 */

// ── Routes that must never be tracked ──────────────────────────────────────
const EXCLUDED_PREFIXES = [
  '/vintage-dashboard',
  '/tweetit-dashboard',
  '/vendor-dashboard',
  '/buyer-dashboard',
  '/seller-dashboard',
  '/blog-editor',
];

function isTrackable(pathname: string): boolean {
  return !EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// ── Funnel staging ──────────────────────────────────────────────────────────
function getFunnelStage(path: string): string | null {
  if (path === '/' || path === '') return 'landing';
  if (path === '/cococonnect' || path === '/shop') return 'browse';
  if (path.startsWith('/shop/product/')) return 'product';
  // NOTE: keep these stage names in sync with the `stages` array in
  // handleFunnel() in api/visitor-tracking.js — they are matched by string.
  if (path === '/shop/checkout') return 'checkout';
  if (path === '/shop/order-confirmed') return 'confirmation';
  if (path === '/contact') return 'contact';
  if (path === '/blog') return 'blog_browse';
  if (path.startsWith('/blog/') && !path.startsWith('/blog-editor')) return 'blog_read';
  if (path === '/vendor-signup' || path === '/buyer-signup') return 'signup';
  if (path === '/vendor-login' || path === '/buyer-login') return 'login';
  if (path === '/cocotech') return 'cocotech';
  if (path === '/cococycle-hub') return 'cococycle';
  if (path === '/about') return 'about';
  return 'other';
}

// ── Session ID ──────────────────────────────────────────────────────────────
const SESSION_KEY = 'coconoto_visitor_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const LAST_ACTIVE_KEY = 'coconoto_visitor_last_active';

function getSessionId(): string {
  try {
    const now = Date.now();
    const lastActive = parseInt(localStorage.getItem(LAST_ACTIVE_KEY) || '0', 10);
    if (lastActive && now - lastActive > SESSION_TIMEOUT_MS) {
      localStorage.removeItem(SESSION_KEY);
    }
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    localStorage.setItem(LAST_ACTIVE_KEY, String(now));
    return id;
  } catch {
    return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function touchSession(): void {
  try { localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now())); } catch { /* */ }
}

// ── Device / browser detection ──────────────────────────────────────────────
function detectDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (/edg/i.test(ua)) return 'edge';
  if (/chrome/i.test(ua) && !/chromium/i.test(ua)) return 'chrome';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'safari';
  if (/firefox/i.test(ua)) return 'firefox';
  return 'other';
}

function detectOS(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (/windows/i.test(ua)) return 'windows';
  if (/mac os|macintosh/i.test(ua)) return 'macos';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/linux/i.test(ua)) return 'linux';
  return 'other';
}

function getExternalReferrer(): string | null {
  try {
    const ref = document.referrer;
    if (!ref) return null;
    const refHost = new URL(ref).hostname;
    if (refHost === window.location.hostname) return null;
    return ref;
  } catch { return null; }
}

// ── Beacon sender (batched) ─────────────────────────────────────────────────
const ENDPOINT = '/api/visitor-tracking';

// Event queue — batch small events together to reduce network calls
const eventQueue: Array<Record<string, unknown>> = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL_MS = 4000;  // flush every 4 seconds
const MAX_QUEUE_SIZE = 15;       // or when queue hits 15 events

function queueEvent(data: Record<string, unknown>): void {
  eventQueue.push(data);
  touchSession();

  if (eventQueue.length >= MAX_QUEUE_SIZE) {
    flushQueue();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flushQueue, FLUSH_INTERVAL_MS);
  }
}

export function flushQueue(): void {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (eventQueue.length === 0) return;

  const batch = eventQueue.splice(0, eventQueue.length);
  sendBeacon({ type: 'batch', events: batch });
}

function sendBeacon(data: Record<string, unknown>): void {
  const payload = JSON.stringify(data);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
  } catch { /* */ }
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch { /* */ }
}

// ── Tracking state ─────────────────────────────────────────────────────────
let sessionStarted = false;
let currentPath = '';
let currentPathEnteredAt = 0;
let maxScrollDepth = 0;
let scrollCheckInterval: ReturnType<typeof setInterval> | null = null;
let mouseTrackInterval: ReturnType<typeof setInterval> | null = null;
let sessionStartTime = 0;
let pageCount = 0;
let clickCount = 0;
let eventSeq = 0;

// Rage click detection state
const recentClicks: Array<{ x: number; y: number; t: number }> = [];

// ── Element analysis ────────────────────────────────────────────────────────
function isInteractiveElement(el: HTMLElement): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (['a', 'button', 'input', 'select', 'textarea', 'label'].includes(tag)) return true;
  if (el.hasAttribute('role')) {
    const role = el.getAttribute('role');
    if (['button', 'link', 'tab', 'checkbox', 'radio', 'menuitem', 'option'].includes(role || '')) return true;
  }
  if (el.hasAttribute('onclick')) return true;
  // Check if element or any ancestor is interactive
  let parent = el.parentElement;
  for (let i = 0; i < 3 && parent; i++) {
    const ptag = parent.tagName.toLowerCase();
    if (['a', 'button', 'label'].includes(ptag)) return true;
    if (parent.hasAttribute('role') && parent.getAttribute('role') === 'button') return true;
    parent = parent.parentElement;
  }
  return false;
}

function getElementInfo(el: HTMLElement) {
  return {
    tag: el.tagName.toLowerCase(),
    text: (el.innerText || el.textContent || '').slice(0, 80).trim(),
    id: el.id || null,
    className: (el.className || '').toString().slice(0, 200),
    href: el.tagName.toLowerCase() === 'a' ? (el as HTMLAnchorElement).href : null,
    isInteractive: isInteractiveElement(el),
  };
}

// ── Session recording: log event to session_events timeline ─────────────────
function logSessionEvent(eventType: string, payload: Record<string, unknown> = {}): void {
  if (!sessionStarted) return;
  const sessionId = getSessionId();
  queueEvent({
    type: 'session_event',
    sessionId,
    seq: ++eventSeq,
    eventType,
    pagePath: currentPath,
    payload,
    elapsedMs: Date.now() - sessionStartTime,
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

export function startSession(path: string): void {
  if (!isTrackable(path)) return;

  const sessionId = getSessionId();
  sessionStartTime = Date.now();
  currentPath = path;
  currentPathEnteredAt = Date.now();
  pageCount = 1;
  eventSeq = 0;

  if (!sessionStarted) {
    sessionStarted = true;
    queueEvent({
      type: 'session_start',
      sessionId,
      path,
      referrer: getExternalReferrer(),
      deviceType: detectDeviceType(),
      browser: detectBrowser(),
      os: detectOS(),
      userAgent: navigator.userAgent.slice(0, 500),
      language: navigator.language || null,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
  }

  // NOTE: deliberately do NOT fire the first page_view here. The
  // VisitorTracker's [pathname] effect calls trackPageChange on mount too, and
  // that is the single place that owns page views. Firing here as well would
  // double-count the landing page (and React StrictMode would triple it).
  startScrollTracking();
  startMouseTracking();
}

export function trackPageChange(path: string): void {
  if (!isTrackable(path)) {
    // Entering a dashboard — flush and stop tracking for this page. Clear
    // currentPath so returning to a public page does not re-close a stale
    // page view with a second exit event.
    if (currentPath) firePageExit(currentPath, 'navigation');
    currentPath = '';
    flushQueue();
    stopScrollTracking();
    stopMouseTracking();
    return;
  }

  if (currentPath && currentPath !== path) {
    firePageExit(currentPath, 'navigation');
  }

  touchSession();
  currentPath = path;
  currentPathEnteredAt = Date.now();
  maxScrollDepth = 0;
  pageCount++;

  firePageView(path);
  logSessionEvent('navigation', { to: path, funnelStage: getFunnelStage(path) });
}

function firePageView(path: string): void {
  const sessionId = getSessionId();
  queueEvent({
    type: 'page_view',
    sessionId,
    path,
    title: document.title || null,
    funnelStage: getFunnelStage(path),
  });
}

function firePageExit(path: string, exitType: string): void {
  const sessionId = getSessionId();
  const durationSec = Math.round((Date.now() - currentPathEnteredAt) / 1000);
  queueEvent({
    type: 'page_exit',
    sessionId,
    path,
    durationSec,
    scrollDepth: maxScrollDepth,
    exitType,
  });
}

export function endSession(): void {
  if (!sessionStarted) return;

  const sessionId = getSessionId();
  const durationSec = Math.round((Date.now() - sessionStartTime) / 1000);

  if (currentPath) firePageExit(currentPath, 'unload');

  queueEvent({
    type: 'session_end',
    sessionId,
    exitPath: currentPath,
    durationSec,
    pageCount,
    clickCount,
  });

  flushQueue(); // Force flush on unload — don't wait for timer
  sessionStarted = false;
}

// ── Click tracking ──────────────────────────────────────────────────────────
export function trackClick(e: MouseEvent): void {
  if (!sessionStarted) return;

  const target = e.target as HTMLElement;
  if (!target) return;

  const sessionId = getSessionId();
  const info = getElementInfo(target);
  clickCount++;

  const clickData = {
    type: 'click',
    sessionId,
    pagePath: currentPath,
    tagName: info.tag,
    elementText: info.text,
    elementId: info.id,
    elementClass: info.className,
    href: info.href,
    clickX: Math.round(e.clientX),
    clickY: Math.round(e.clientY),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    scrollY: Math.round(e.clientY + window.scrollY),
    docScrollY: Math.round(window.scrollY),
    isInteractive: info.isInteractive,
  };

  queueEvent(clickData);
  logSessionEvent('click', {
    tag: info.tag,
    text: info.text?.slice(0, 40),
    x: Math.round(e.clientX),
    y: Math.round(e.clientY),
    interactive: info.isInteractive,
  });

  // ── Dead click detection ──────────────────────────────────────────────
  if (!info.isInteractive) {
    queueEvent({
      type: 'dead_click',
      sessionId,
      pagePath: currentPath,
      tagName: info.tag,
      elementText: info.text,
      elementClass: info.className,
      clickX: Math.round(e.clientX),
      clickY: Math.round(e.clientY),
    });
  }

  // ── Rage click detection ──────────────────────────────────────────────
  const now = Date.now();
  recentClicks.push({ x: Math.round(e.clientX), y: Math.round(e.clientY), t: now });
  // Keep only clicks from last 2 seconds
  while (recentClicks.length > 0 && now - recentClicks[0].t > 2000) {
    recentClicks.shift();
  }
  // 3+ clicks within 50px radius in 2 seconds = rage
  if (recentClicks.length >= 3) {
    const first = recentClicks[0];
    const last = recentClicks[recentClicks.length - 1];
    const dist = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);
    if (dist < 50) {
      queueEvent({
        type: 'rage_click',
        sessionId,
        pagePath: currentPath,
        elementTag: info.tag,
        elementText: info.text,
        clickCount: recentClicks.length,
        areaX: Math.round((first.x + last.x) / 2),
        areaY: Math.round((first.y + last.y) / 2),
      });
      // Clear to avoid re-firing for the same burst
      recentClicks.length = 0;
    }
  }
}

// ── Scroll tracking ─────────────────────────────────────────────────────────
function getScrollDepth(): number {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 100;
  return Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
}

function startScrollTracking(): void {
  if (scrollCheckInterval) clearInterval(scrollCheckInterval);

  scrollCheckInterval = setInterval(() => {
    const depth = getScrollDepth();
    if (depth > maxScrollDepth) {
      maxScrollDepth = depth;

      // Send scroll update at milestones
      if ([25, 50, 75, 90, 100].includes(depth)) {
        const sessionId = getSessionId();
        queueEvent({
          type: 'scroll_update',
          sessionId,
          path: currentPath,
          scrollDepth: maxScrollDepth,
        });
        logSessionEvent('scroll', { depth: maxScrollDepth });
      }
    }
  }, 3000);
}

function stopScrollTracking(): void {
  if (scrollCheckInterval) { clearInterval(scrollCheckInterval); scrollCheckInterval = null; }
}

// ── Mouse movement sampling (for cursor heatmaps) ───────────────────────────
// Sample mouse position every 500ms — not every mousemove event (perf)
const mouseSamples: Array<{ x: number; y: number; t: number }> = [];
let lastMouseSampleAt = 0;

function startMouseTracking(): void {
  if (mouseTrackInterval) clearInterval(mouseTrackInterval);

  // Collect samples, flush them as a batch periodically
  mouseTrackInterval = setInterval(() => {
    if (mouseSamples.length === 0) return;
    const sessionId = getSessionId();
    const samples = mouseSamples.splice(0, mouseSamples.length);
    queueEvent({
      type: 'mouse_samples',
      sessionId,
      pagePath: currentPath,
      samples: samples.map(s => ({ x: s.x, y: s.y })),
    });
  }, 5000);
}

function stopMouseTracking(): void {
  if (mouseTrackInterval) { clearInterval(mouseTrackInterval); mouseTrackInterval = null; }
}

export function trackMouseMove(e: MouseEvent): void {
  if (!sessionStarted) return;
  const now = Date.now();
  // Throttle to max 1 sample per 200ms
  if (now - lastMouseSampleAt < 200) return;
  lastMouseSampleAt = now;
  mouseSamples.push({ x: Math.round(e.clientX), y: Math.round(e.clientY), t: now });
  // Cap samples to avoid memory blowup
  if (mouseSamples.length > 50) mouseSamples.shift();
}

// ── Visibility tracking ─────────────────────────────────────────────────────
export function handleVisibilityChange(): void {
  if (document.hidden) {
    if (currentPath) firePageExit(currentPath, 'hidden');
    stopScrollTracking();
    stopMouseTracking();
    logSessionEvent('visibility', { visible: false });
  } else {
    if (sessionStarted && currentPath) {
      currentPathEnteredAt = Date.now();
      maxScrollDepth = getScrollDepth();
      startScrollTracking();
      startMouseTracking();
      touchSession();
      logSessionEvent('visibility', { visible: true });
    }
  }
}

// ── Custom events (conversions, form submits, etc.) ────────────────────────
export function trackCustomEvent(name: string, data?: Record<string, unknown>): void {
  const sessionId = getSessionId();
  queueEvent({
    type: 'custom_event',
    sessionId,
    eventName: name,
    pagePath: currentPath || window.location.pathname,
    metadata: data || null,
  });
  logSessionEvent('custom', { name, ...data });

  // If this is a conversion event, mark the session
  if (['order_placed', 'signup_completed', 'contact_form_submitted', 'waitlist_joined'].includes(name)) {
    queueEvent({
      type: 'conversion',
      sessionId,
      conversionEvent: name,
      pagePath: currentPath || window.location.pathname,
    });
  }
}

// ── Resize tracking ─────────────────────────────────────────────────────────
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
export function trackResize(): void {
  if (!sessionStarted) return;
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    logSessionEvent('resize', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 500);
}
