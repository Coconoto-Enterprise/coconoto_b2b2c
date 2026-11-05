// api/visitor-tracking.js
//
// Self-hosted visitor analytics: ingestion + retrieval.
// Full Clarity replacement built on Supabase + Vercel.
//
// POST /api/visitor-tracking  — write events from the browser tracker.
//   Single event:  { type: 'session_start', ... }
//   Batch:         { type: 'batch', events: [{ type: 'click', ... }, ...] }
//   Open to public visitors (they must be able to record their own session).
//   The browser NEVER talks to Supabase: `anon` has ZERO privileges on the
//   analytics tables. This function writes with SUPABASE_SERVICE_ROLE_KEY.
//
// GET  /api/visitor-tracking?action=summary&since=YYYY-MM-DD&until=YYYY-MM-DD
// GET  /api/visitor-tracking?action=live
// GET  /api/visitor-tracking?action=recent&limit=50
// GET  /api/visitor-tracking?action=heatmap&path=/&since=...&until=...
// GET  /api/visitor-tracking?action=funnel&since=...&until=...
// GET  /api/visitor-tracking?action=recordings&sessionId=...
//   Dashboard reads: gated by an Origin allowlist check (see below).

import { applyCorsAllowlist, getAllowedOrigins } from '../lib/shared-auth.js';
import { createClient } from '@supabase/supabase-js';

// ── Bot detection patterns ─────────────────────────────────────────────────
const BOT_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
  /whatsapp/i, /telegrambot/i, /applebot/i, /petalbot/i, /bytespider/i,
  /crawler/i, /spider/i, /scraper/i, /headless/i, /phantom/i, /puppeteer/i,
  /lighthouse/i, /pingdom/i, /gtmetrix/i, /chrome-lighthouse/i,
  /bot\b/i, /crawl\b/i,
];

function isBot(ua) {
  if (!ua) return false;
  return BOT_PATTERNS.some((p) => p.test(ua));
}

/**
 * Gate for dashboard reads.
 *
 * The owner dashboard is gated client-side by localStorage('adminLoggedIn')
 * and has NO server-side session (see /api/data and /api/marketplace-accounts).
 * There is therefore no secret a browser panel could present. We do the one
 * thing that is available: reject requests whose Origin is not allowlisted.
 * `applyCorsAllowlist` alone only sets headers — it does not refuse the
 * response — so this is an explicit check, slightly stronger than the rest
 * of the dashboard. Non-browser callers send no Origin; closing that gap
 * requires real admin auth, which is a project-wide follow-up.
 *
 * Writes (POST) are intentionally ungated: any public visitor must be able to
 * record their own session. They are validated, bounded and write-only.
 */
function authorizeDashboardRead(req, res) {
  const origin = req.headers?.origin;
  if (origin && !getAllowedOrigins().includes(origin)) {
    res.status(403).json({ success: false, error: 'Forbidden origin' });
    return false;
  }
  return true;
}

// ── Supabase client (cached across warm invocations) ───────────────────────
let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
}

export default async function handler(req, res) {
  applyCorsAllowlist(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GeoIP from Vercel headers (free, no external API) ──────────────────
  const geo = {
    country: req.headers['x-vercel-ip-country'] || null,
    region: req.headers['x-vercel-ip-country-region'] || null,
    city: req.headers['x-vercel-ip-city'] || null,
  };

  // ════════════════════════════════════════════════════════════════════════
  // POST — ingest events from the browser
  // ════════════════════════════════════════════════════════════════════════
  if (req.method === 'POST') {
    const supabase = getSupabase();
    if (!supabase) return res.status(200).json({ success: true, skipped: true });

    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch {
      return res.status(200).json({ success: true, skipped: true });
    }

    // Unwrap batch
    const events = body.type === 'batch' ? (body.events || []) : [body];

    // Process each event
    for (const evt of events) {
      try {
        await processEvent(supabase, evt, geo, req);
      } catch (err) {
        console.error('[visitor-tracking] event error:', evt.type, err.message);
      }
    }

    return res.status(200).json({ success: true, processed: events.length });
  }

  // ════════════════════════════════════════════════════════════════════════
  // GET — dashboard queries (Origin allowlist gate)
  // ════════════════════════════════════════════════════════════════════════
  if (req.method === 'GET') {
    if (!authorizeDashboardRead(req, res)) return;

    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ success: false, error: 'Supabase not configured' });

    const action = req.query?.action || 'summary';
    const since = req.query?.since || new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const until = req.query?.until || new Date().toISOString().slice(0, 10);
    const sinceDate = `${since}T00:00:00Z`;
    const untilDate = `${until}T23:59:59Z`;

    try {
      switch (action) {
        case 'summary': return await handleSummary(supabase, res, sinceDate, untilDate, since, until);
        case 'live': return await handleLive(supabase, res);
        case 'recent': return await handleRecent(supabase, res, req);
        case 'heatmap': return await handleHeatmap(supabase, res, req, sinceDate, untilDate);
        case 'funnel': return await handleFunnel(supabase, res, sinceDate, untilDate);
        case 'recordings': return await handleRecordings(supabase, res, req);
        case 'rage_clicks': return await handleRageClicks(supabase, res, req, sinceDate, untilDate);
        case 'dead_clicks': return await handleDeadClicks(supabase, res, req, sinceDate, untilDate);
        case 'custom_events': return await handleCustomEvents(supabase, res, sinceDate, untilDate);
        default:
          return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
      }
    } catch (err) {
      console.error('[visitor-tracking] GET error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

// ════════════════════════════════════════════════════════════════════════════
// Event processor
// ════════════════════════════════════════════════════════════════════════════
async function processEvent(supabase, evt, geo, req) {
  const { type } = evt;
  const ua = evt.userAgent || req.headers['user-agent'] || '';
  const botFlag = isBot(ua);

  switch (type) {
    // ── Session start ──────────────────────────────────────────────────────
    case 'session_start': {
      const { sessionId, path, referrer, deviceType, browser, os, language,
              screenWidth, screenHeight, viewportWidth, viewportHeight } = evt;
      if (!sessionId || !path) return;

      let referrerHost = null;
      if (referrer) {
        try { referrerHost = new URL(referrer).hostname; } catch {}
      }

      await supabase.from('visitor_sessions').upsert({
        id: sessionId,
        entry_path: path,
        referrer: referrer || null,
        referrer_host: referrerHost,
        device_type: deviceType || 'desktop',
        browser: browser || null,
        os: os || null,
        user_agent: ua.slice(0, 500) || null,
        language: language || null,
        screen_width: screenWidth || null,
        screen_height: screenHeight || null,
        viewport_width: viewportWidth || null,
        viewport_height: viewportHeight || null,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        started_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        // page_count starts at 0; the first page_view bumps it to 1.
        page_count: 0,
        click_count: 0,
        is_bounce: true,
        is_bot: botFlag,
      }, { onConflict: 'id' });
      return;
    }

    // ── Page view ──────────────────────────────────────────────────────────
    case 'page_view': {
      const { sessionId, path, title, funnelStage } = evt;
      if (!sessionId || !path) return;

      // Close previous open page view
      await supabase.from('page_views')
        .update({ exited_at: new Date().toISOString(), exit_type: 'navigation' })
        .eq('session_id', sessionId).is('exited_at', null);

      await supabase.from('page_views').insert({
        session_id: sessionId, path, title: title || null,
        entered_at: new Date().toISOString(), funnel_stage: funnelStage || null,
      });

      // Bump page count atomically (PostgREST has no increment expression).
      // Bounce is derived in SQL: <= 1 page view.
      const { error: bumpErr } = await supabase.rpc('bump_session_activity', {
        p_session_id: sessionId, p_pages: 1, p_clicks: 0,
      });
      if (bumpErr) console.error('[visitor-tracking] bump_session_activity:', bumpErr.message);
      return;
    }

    // ── Page exit ───────────────────────────────────────────────────────────
    case 'page_exit': {
      const { sessionId, path, durationSec, scrollDepth, exitType } = evt;
      if (!sessionId || !path) return;

      await supabase.from('page_views')
        .update({
          exited_at: new Date().toISOString(),
          duration_sec: durationSec || null,
          scroll_depth: Math.min(100, Math.max(0, scrollDepth || 0)),
          exit_type: exitType || 'navigation',
        })
        .eq('session_id', sessionId).eq('path', path)
        .is('exited_at', null)
        .order('entered_at', { ascending: false }).limit(1);
      return;
    }

    // ── Session end ─────────────────────────────────────────────────────────
    case 'session_end': {
      const { sessionId, exitPath, durationSec, pageCount, clickCount } = evt;
      if (!sessionId) return;

      // Close remaining open page views
      await supabase.from('page_views')
        .update({ exited_at: new Date().toISOString(), exit_type: 'unload', is_exit: false })
        .eq('session_id', sessionId).is('exited_at', null);

      // Mark last page view as exit
      const { data: last } = await supabase.from('page_views')
        .select('id').eq('session_id', sessionId)
        .order('entered_at', { ascending: false }).limit(1).maybeSingle();
      if (last) {
        await supabase.from('page_views').update({ is_exit: true }).eq('id', last.id);
      }

      // page_count / click_count are NOT overwritten from the client — the
      // server-side atomic counters are authoritative (they survive a lost
      // unload beacon). The client values are only a sanity cross-check.
      await supabase.from('visitor_sessions').update({
        ended_at: new Date().toISOString(),
        exit_path: exitPath || null,
        duration_sec: durationSec || null,
        last_active: new Date().toISOString(),
      }).eq('id', sessionId);
      return;
    }

    // ── Click ────────────────────────────────────────────────────────────────
    case 'click': {
      const { sessionId, pagePath, tagName, elementText, elementId, elementClass,
              href, clickX, clickY, viewportWidth, viewportHeight, scrollY,
              docScrollY, isInteractive } = evt;
      if (!sessionId || !pagePath) return;

      await supabase.from('click_events').insert({
        session_id: sessionId, page_path: pagePath,
        tag_name: tagName || null, element_text: (elementText || '').slice(0, 80),
        element_id: elementId || null, element_class: (elementClass || '').slice(0, 200),
        href: href || null,
        click_x: clickX || 0, click_y: clickY || 0,
        viewport_width: viewportWidth || null, viewport_height: viewportHeight || null,
        scroll_y: scrollY || null, doc_scroll_y: docScrollY || null,
        is_interactive: isInteractive !== false,
      });

      // Increment session click count atomically
      await supabase.rpc('bump_session_activity', {
        p_session_id: sessionId, p_pages: 0, p_clicks: 1,
      });
      return;
    }

    // ── Dead click ───────────────────────────────────────────────────────────
    case 'dead_click': {
      const { sessionId, pagePath, tagName, elementText, elementClass, clickX, clickY } = evt;
      if (!sessionId || !pagePath) return;

      await supabase.from('dead_clicks').insert({
        session_id: sessionId, page_path: pagePath,
        tag_name: tagName || null, element_text: (elementText || '').slice(0, 80),
        element_class: (elementClass || '').slice(0, 200),
        click_x: clickX || 0, click_y: clickY || 0,
      });
      return;
    }

    // ── Rage click ───────────────────────────────────────────────────────────
    case 'rage_click': {
      const { sessionId, pagePath, elementTag, elementText, clickCount: rageCount, areaX, areaY } = evt;
      if (!sessionId || !pagePath) return;

      await supabase.from('rage_clicks').insert({
        session_id: sessionId, page_path: pagePath,
        element_tag: elementTag || null, element_text: (elementText || '').slice(0, 80),
        click_count: rageCount || 3,
        area_x: areaX || null, area_y: areaY || null,
      });
      return;
    }

    // ── Scroll update ────────────────────────────────────────────────────────
    case 'scroll_update': {
      const { sessionId, path, scrollDepth } = evt;
      if (!sessionId || !path) return;

      await supabase.from('page_views')
        .update({ scroll_depth: Math.min(100, Math.max(0, scrollDepth || 0)) })
        .eq('session_id', sessionId).eq('path', path)
        .is('exited_at', null)
        .order('entered_at', { ascending: false }).limit(1);

      // Update scroll heatmap bucket atomically
      const bucket = Math.min(3, Math.floor((scrollDepth || 0) / 25));
      const today = new Date().toISOString().slice(0, 10);
      const { error: shErr } = await supabase.rpc('bump_scroll_heatmap', {
        p_path: path, p_bucket: bucket, p_date: today,
      });
      if (shErr) console.error('[visitor-tracking] bump_scroll_heatmap:', shErr.message);
      return;
    }

    // ── Mouse samples ────────────────────────────────────────────────────────
    case 'mouse_samples': {
      const { sessionId, pagePath, samples } = evt;
      if (!sessionId || !pagePath || !samples?.length) return;

      // Store as a session event (compact JSON)
      await supabase.from('session_events').insert({
        session_id: sessionId,
        seq: evt.seq || Math.floor(Math.random() * 100000),
        event_type: 'mouse_samples',
        page_path: pagePath,
        payload: { samples },
        elapsed_ms: evt.elapsedMs || null,
      });
      return;
    }

    // ── Session event (for replay timeline) ──────────────────────────────────
    case 'session_event': {
      const { sessionId, seq, eventType, pagePath, payload, elapsedMs } = evt;
      if (!sessionId) return;

      await supabase.from('session_events').insert({
        session_id: sessionId,
        seq: seq || Math.floor(Math.random() * 100000),
        event_type: eventType || 'unknown',
        page_path: pagePath || null,
        payload: payload || null,
        elapsed_ms: elapsedMs || null,
      });

      // Touch session activity
      await supabase.from('visitor_sessions')
        .update({ last_active: new Date().toISOString() })
        .eq('id', sessionId);
      return;
    }

    // ── Custom event ─────────────────────────────────────────────────────────
    case 'custom_event': {
      const { sessionId, eventName, pagePath, metadata } = evt;
      if (!sessionId || !eventName) return;

      await supabase.from('custom_events').insert({
        session_id: sessionId, event_name: eventName,
        page_path: pagePath || null, metadata: metadata || null,
      });
      return;
    }

    // ── Conversion ───────────────────────────────────────────────────────────
    case 'conversion': {
      const { sessionId, conversionEvent, pagePath } = evt;
      if (!sessionId) return;

      await supabase.from('visitor_sessions')
        .update({
          converted: true,
          conversion_event: conversionEvent || null,
          last_active: new Date().toISOString(),
        })
        .eq('id', sessionId);
      return;
    }

    default:
      // Unknown event type — silently skip
      return;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// GET handlers
// ════════════════════════════════════════════════════════════════════════════

async function handleSummary(supabase, res, sinceDate, untilDate, since, until) {
  // Sessions
  const { data: sessions } = await supabase.from('visitor_sessions')
    .select('started_at, ended_at, device_type, browser, os, country, is_bounce, is_bot, converted, duration_sec, page_count, click_count')
    .gte('started_at', sinceDate).lte('started_at', untilDate)
    .order('started_at', { ascending: true });

  // Page views
  const { data: pages } = await supabase.from('page_views')
    .select('path, entered_at, duration_sec, scroll_depth, is_exit, funnel_stage')
    .gte('entered_at', sinceDate).lte('entered_at', untilDate);

  // Referrers
  const { data: refs } = await supabase.from('visitor_sessions')
    .select('referrer_host').not('referrer_host', 'is', null)
    .neq('referrer_host', '')
    .gte('started_at', sinceDate).lte('started_at', untilDate);

  // Active now
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: activeNow } = await supabase.from('visitor_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('last_active', fiveMinAgo).is('ended_at', null);

  // Custom events
  const { data: events } = await supabase.from('custom_events')
    .select('event_name, created_at')
    .gte('created_at', sinceDate).lte('created_at', untilDate);

  // Rage clicks
  const { count: rageCount } = await supabase.from('rage_clicks')
    .select('*', { count: 'exact', head: true })
    .gte('detected_at', sinceDate).lte('detected_at', untilDate);

  // Dead clicks
  const { count: deadCount } = await supabase.from('dead_clicks')
    .select('*', { count: 'exact', head: true })
    .gte('clicked_at', sinceDate).lte('clicked_at', untilDate);

  // ── Aggregate ───────────────────────────────────────────────────────────
  const humanSessions = (sessions || []).filter(s => !s.is_bot);
  const totalSessions = humanSessions.length;
  const totalBounces = humanSessions.filter(s => s.is_bounce).length;
  const bounceRate = totalSessions ? Math.round((totalBounces / totalSessions) * 100) : 0;
  const avgDuration = totalSessions ? Math.round(humanSessions.reduce((a, s) => a + (s.duration_sec || 0), 0) / totalSessions) : 0;
  const avgPages = totalSessions ? Math.round((humanSessions.reduce((a, s) => a + (s.page_count || 0), 0) / totalSessions) * 10) / 10 : 0;
  const avgClicks = totalSessions ? Math.round(humanSessions.reduce((a, s) => a + (s.click_count || 0), 0) / totalSessions) : 0;
  const conversions = humanSessions.filter(s => s.converted).length;
  const conversionRate = totalSessions ? ((conversions / totalSessions) * 100).toFixed(1) : '0';

  // Devices
  const devices = { mobile: 0, desktop: 0, tablet: 0 };
  humanSessions.forEach(s => { if (devices[s.device_type] !== undefined) devices[s.device_type]++; });

  // Browsers
  const browsers = {};
  humanSessions.forEach(s => { if (s.browser) browsers[s.browser] = (browsers[s.browser] || 0) + 1; });

  // OS
  const osMap = {};
  humanSessions.forEach(s => { if (s.os) osMap[s.os] = (osMap[s.os] || 0) + 1; });

  // Countries
  const countries = {};
  humanSessions.forEach(s => { if (s.country) countries[s.country] = (countries[s.country] || 0) + 1; });

  // Timeseries
  const byDay = {};
  humanSessions.forEach(s => {
    const day = s.started_at.slice(0, 10);
    if (!byDay[day]) byDay[day] = { date: day, sessions: 0, bounces: 0, totalDuration: 0, conversions: 0 };
    byDay[day].sessions++;
    if (s.is_bounce) byDay[day].bounces++;
    byDay[day].totalDuration += s.duration_sec || 0;
    if (s.converted) byDay[day].conversions++;
  });

  const timeseries = Object.values(byDay).map(d => ({
    date: d.date, sessions: d.sessions, bounces: d.bounces,
    avg_duration_sec: d.sessions ? Math.round(d.totalDuration / d.sessions) : 0,
    conversions: d.conversions,
  }));

  // Top pages
  const pageMap = {};
  (pages || []).forEach(pv => {
    if (!pageMap[pv.path]) pageMap[pv.path] = { path: pv.path, views: 0, totalDuration: 0, durCount: 0, totalScroll: 0, exits: 0 };
    pageMap[pv.path].views++;
    if (pv.duration_sec) { pageMap[pv.path].totalDuration += pv.duration_sec; pageMap[pv.path].durCount++; }
    pageMap[pv.path].totalScroll += pv.scroll_depth || 0;
    if (pv.is_exit) pageMap[pv.path].exits++;
  });

  const topPages = Object.values(pageMap).map(p => ({
    path: p.path, views: p.views,
    avg_duration_sec: p.durCount ? Math.round(p.totalDuration / p.durCount) : 0,
    avg_scroll_depth: p.views ? Math.round(p.totalScroll / p.views) : 0,
    exit_rate: p.views ? Math.round((p.exits / p.views) * 100) : 0,
  })).sort((a, b) => b.views - a.views).slice(0, 20);

  // Top referrers
  const refMap = {};
  (refs || []).forEach(s => { refMap[s.referrer_host] = (refMap[s.referrer_host] || 0) + 1; });
  const topReferrers = Object.entries(refMap).map(([host, count]) => ({ host, count }))
    .sort((a, b) => b.count - a.count).slice(0, 10);

  // Top countries
  const topCountries = Object.entries(countries).map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count).slice(0, 10);

  // Custom events breakdown
  const eventMap = {};
  (events || []).forEach(e => { eventMap[e.event_name] = (eventMap[e.event_name] || 0) + 1; });
  const eventBreakdown = Object.entries(eventMap).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return res.status(200).json({
    success: true,
    range: { since, until },
    totals: {
      sessions: totalSessions,
      bot_sessions: (sessions || []).filter(s => s.is_bot).length,
      active_now: activeNow || 0,
      bounce_rate: bounceRate,
      avg_duration_sec: avgDuration,
      avg_pages_per_session: avgPages,
      avg_clicks_per_session: avgClicks,
      conversions,
      conversion_rate: parseFloat(conversionRate),
      rage_clicks: rageCount || 0,
      dead_clicks: deadCount || 0,
    },
    breakdowns: { devices, browsers, os: osMap, countries: topCountries },
    timeseries,
    top_pages: topPages,
    top_referrers: topReferrers,
    custom_events: eventBreakdown,
  });
}

async function handleLive(supabase, res) {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data: live } = await supabase.from('visitor_sessions')
    .select(`
      id, entry_path, device_type, browser, os, country, city,
      started_at, last_active, page_count, click_count,
      page_views(path, title, entered_at, scroll_depth, funnel_stage)
    `)
    .gte('last_active', fiveMinAgo).is('ended_at', null)
    .order('last_active', { ascending: false }).limit(50);

  return res.status(200).json({
    success: true,
    active_count: live?.length || 0,
    visitors: live || [],
  });
}

async function handleRecent(supabase, res, req) {
  const limit = Math.min(100, parseInt(req.query?.limit || '50', 10));

  const { data: sessions } = await supabase.from('visitor_sessions')
    .select('*').order('started_at', { ascending: false }).limit(limit);

  const ids = (sessions || []).map(s => s.id);
  const { data: pageViews } = await supabase.from('page_views')
    .select('*').in('session_id', ids).order('entered_at', { ascending: true });

  const viewsBySession = {};
  (pageViews || []).forEach(pv => {
    if (!viewsBySession[pv.session_id]) viewsBySession[pv.session_id] = [];
    viewsBySession[pv.session_id].push(pv);
  });

  return res.status(200).json({
    success: true,
    sessions: (sessions || []).map(s => ({ ...s, page_views: viewsBySession[s.id] || [] })),
  });
}

async function handleHeatmap(supabase, res, req, sinceDate, untilDate) {
  const path = req.query?.path || '/';

  const { data: clicks } = await supabase.from('click_events')
    .select('click_x, click_y, viewport_width, viewport_height, doc_scroll_y, is_interactive')
    .eq('page_path', path)
    .gte('clicked_at', sinceDate).lte('clicked_at', untilDate)
    .limit(5000);

  const { data: scroll } = await supabase.from('scroll_heatmap')
    .select('bucket, reach_count')
    .eq('page_path', path)
    .gte('date', sinceDate.slice(0, 10)).lte('date', untilDate.slice(0, 10));

  return res.status(200).json({
    success: true,
    path,
    clicks: clicks || [],
    scroll_buckets: scroll || [],
    click_count: clicks?.length || 0,
  });
}

async function handleFunnel(supabase, res, sinceDate, untilDate) {
  // Must match getFunnelStage() in src/lib/visitorTracking.ts exactly — these
  // are the real /shop steps: / → /shop → /shop/product/:slug →
  // /shop/checkout → /shop/order-confirmed. /cococonnect is a separate
  // marketplace funnel and is intentionally not a stage here.
  const stages = ['landing', 'browse', 'product', 'checkout', 'confirmation'];

  const { data } = await supabase.from('page_views')
    .select('session_id, funnel_stage')
    .not('funnel_stage', 'is', null)
    .gte('entered_at', sinceDate).lte('entered_at', untilDate);

  // Count unique sessions per stage
  const stageSessions = {};
  stages.forEach(s => stageSessions[s] = new Set());
  (data || []).forEach(pv => {
    if (stageSessions[pv.funnel_stage]) stageSessions[pv.funnel_stage].add(pv.session_id);
  });

  const funnel = stages.map((stage, i) => {
    const count = stageSessions[stage].size;
    const prevCount = i > 0 ? stageSessions[stages[i - 1]].size : count;
    // A session can enter mid-funnel (e.g. a saved /shop/checkout link), so a
    // later stage may legitimately outnumber an earlier one. Clamp to 0 rather
    // than rendering a nonsensical negative "drop".
    const dropOff = i > 0 && prevCount > 0
      ? Math.max(0, Math.min(100, Math.round(((prevCount - count) / prevCount) * 100)))
      : 0;
    return { stage, count, drop_off_rate: dropOff };
  });

  return res.status(200).json({ success: true, funnel });
}

async function handleRecordings(supabase, res, req) {
  const sessionId = req.query?.sessionId;
  if (!sessionId) return res.status(400).json({ success: false, error: 'sessionId required' });

  const { data: session } = await supabase.from('visitor_sessions')
    .select('*').eq('id', sessionId).maybeSingle();

  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

  const { data: events } = await supabase.from('session_events')
    .select('*').eq('session_id', sessionId)
    .order('seq', { ascending: true }).limit(5000);

  const { data: pageViews } = await supabase.from('page_views')
    .select('*').eq('session_id', sessionId)
    .order('entered_at', { ascending: true });

  return res.status(200).json({
    success: true,
    session,
    page_views: pageViews || [],
    events: events || [],
  });
}

async function handleRageClicks(supabase, res, req, sinceDate, untilDate) {
  const path = req.query?.path;
  let query = supabase.from('rage_clicks')
    .select('*').gte('detected_at', sinceDate).lte('detected_at', untilDate)
    .order('detected_at', { ascending: false }).limit(200);
  if (path) query = query.eq('page_path', path);

  const { data, error } = await query;
  if (error) throw error;
  return res.status(200).json({ success: true, rage_clicks: data || [] });
}

async function handleDeadClicks(supabase, res, req, sinceDate, untilDate) {
  const path = req.query?.path;
  let query = supabase.from('dead_clicks')
    .select('*').gte('clicked_at', sinceDate).lte('clicked_at', untilDate)
    .order('clicked_at', { ascending: false }).limit(200);
  if (path) query = query.eq('page_path', path);

  const { data, error } = await query;
  if (error) throw error;
  return res.status(200).json({ success: true, dead_clicks: data || [] });
}

async function handleCustomEvents(supabase, res, sinceDate, untilDate) {
  const { data, error } = await supabase.from('custom_events')
    .select('*').gte('created_at', sinceDate).lte('created_at', untilDate)
    .order('created_at', { ascending: false }).limit(200);
  if (error) throw error;
  return res.status(200).json({ success: true, events: data || [] });
}
