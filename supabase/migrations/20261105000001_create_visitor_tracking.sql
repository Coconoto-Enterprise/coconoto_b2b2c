-- ============================================================================
-- Self-hosted visitor analytics — full Clarity replacement
-- Run ONCE in the Supabase SQL editor. Vercel does NOT auto-apply migrations.
--
-- Tables:
--   1. visitor_sessions   — one row per browsing session
--   2. page_views         — one row per SPA route viewed
--   3. click_events       — every click (element + coords) → click heatmap
--   4. rage_clicks        — 3+ rapid clicks in one spot (frustration)
--   5. dead_clicks        — clicks on non-interactive elements
--   6. scroll_heatmap     — aggregated scroll-depth buckets per page/day
--   7. custom_events      — conversions and named business events
--   8. session_events     — event timeline for session replay
--
-- The browser never touches Supabase directly: it POSTs to
-- /api/visitor-tracking, which uses the service-role key. `anon` therefore
-- gets NO privileges on any of these tables.
-- ============================================================================

-- ── 1. Sessions ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id                text PRIMARY KEY,
  entry_path        text NOT NULL,
  exit_path         text,
  referrer          text,
  referrer_host     text,
  device_type       text NOT NULL DEFAULT 'desktop',
  browser           text,
  os                text,
  user_agent        text,
  language          text,
  screen_width      integer,
  screen_height     integer,
  viewport_width    integer,
  viewport_height   integer,
  -- GeoIP from Vercel's x-vercel-ip-* headers (free, no external service)
  country           text,
  region            text,
  city              text,
  -- Lifecycle
  started_at        timestamptz NOT NULL DEFAULT now(),
  last_active       timestamptz NOT NULL DEFAULT now(),
  ended_at          timestamptz,
  page_count        integer NOT NULL DEFAULT 0,
  click_count       integer NOT NULL DEFAULT 0,
  duration_sec      integer,
  is_bounce         boolean DEFAULT true,
  is_bot            boolean DEFAULT false,
  -- Conversion
  converted         boolean DEFAULT false,
  conversion_event  text
);

CREATE INDEX IF NOT EXISTS idx_vs_started  ON public.visitor_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_vs_active   ON public.visitor_sessions (last_active DESC);
CREATE INDEX IF NOT EXISTS idx_vs_country  ON public.visitor_sessions (country);
CREATE INDEX IF NOT EXISTS idx_vs_refhost  ON public.visitor_sessions (referrer_host);

-- ── 2. Page views ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.page_views (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id      text NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  path            text NOT NULL,
  title           text,
  entered_at      timestamptz NOT NULL DEFAULT now(),
  exited_at       timestamptz,
  duration_sec    integer,
  scroll_depth    integer NOT NULL DEFAULT 0,
  exit_type       text,
  is_exit         boolean DEFAULT false,
  funnel_stage    text
);

CREATE INDEX IF NOT EXISTS idx_pv_session ON public.page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_pv_path    ON public.page_views (path);
CREATE INDEX IF NOT EXISTS idx_pv_entered ON public.page_views (entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_funnel  ON public.page_views (funnel_stage);

-- ── 3. Click events ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.click_events (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id      text NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  page_path       text NOT NULL,
  tag_name        text,
  element_text    text,
  element_id      text,
  element_class   text,
  href            text,
  click_x         integer NOT NULL,
  click_y         integer NOT NULL,
  viewport_width  integer,
  viewport_height integer,
  scroll_y        integer,
  doc_scroll_y    integer,
  clicked_at      timestamptz NOT NULL DEFAULT now(),
  is_interactive  boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_click_session ON public.click_events (session_id);
CREATE INDEX IF NOT EXISTS idx_click_path    ON public.click_events (page_path);
CREATE INDEX IF NOT EXISTS idx_click_time    ON public.click_events (clicked_at DESC);

-- ── 4. Rage clicks ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.rage_clicks (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id    text NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  page_path     text NOT NULL,
  element_tag   text,
  element_text  text,
  click_count   integer NOT NULL,
  area_x        integer,
  area_y        integer,
  detected_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rc_path ON public.rage_clicks (page_path);
CREATE INDEX IF NOT EXISTS idx_rc_time ON public.rage_clicks (detected_at DESC);

-- ── 5. Dead clicks ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.dead_clicks (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id    text NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  page_path     text NOT NULL,
  tag_name      text,
  element_text  text,
  element_class text,
  click_x       integer,
  click_y       integer,
  clicked_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dc_path ON public.dead_clicks (page_path);
CREATE INDEX IF NOT EXISTS idx_dc_time ON public.dead_clicks (clicked_at DESC);

-- ── 6. Scroll heatmap ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.scroll_heatmap (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page_path     text NOT NULL,
  bucket        integer NOT NULL,             -- 0=0-25%, 1=25-50%, 2=50-75%, 3=75-100%
  reach_count   integer NOT NULL DEFAULT 0,
  date          date NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(page_path, bucket, date)
);

CREATE INDEX IF NOT EXISTS idx_sh_path_date ON public.scroll_heatmap (page_path, date);

-- ── 7. Custom events ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.custom_events (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id    text NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  event_name    text NOT NULL,
  page_path     text,
  metadata      jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_name    ON public.custom_events (event_name);
CREATE INDEX IF NOT EXISTS idx_custom_session ON public.custom_events (session_id);
CREATE INDEX IF NOT EXISTS idx_custom_time    ON public.custom_events (created_at DESC);

-- ── 8. Session event timeline (replay) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.session_events (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id    text NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  seq           integer NOT NULL,
  event_type    text NOT NULL,
  page_path     text,
  payload       jsonb,
  timestamp     timestamptz NOT NULL DEFAULT now(),
  elapsed_ms    integer
);

CREATE INDEX IF NOT EXISTS idx_se_session_seq ON public.session_events (session_id, seq);
CREATE INDEX IF NOT EXISTS idx_se_time        ON public.session_events (timestamp DESC);

-- ════════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════════════
-- `anon` gets NO privileges at all. An anon UPDATE policy with USING(true)
-- would let anyone holding the public anon key rewrite every session row.
-- service_role bypasses RLS and is the only role that can read/write here.
--
-- These are written as LITERAL statements on purpose. Supabase SQL editor's
-- "Potential issue detected / enable RLS?" checker does static parsing and
-- cannot see RLS enabled from inside a generated-SQL PL/pgSQL loop, so it
-- wrongly warns that the tables are unprotected.

ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rage_clicks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dead_clicks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scroll_heatmap   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_events   ENABLE ROW LEVEL SECURITY;

-- Supabase grants new tables to anon/authenticated by default via ALTER DEFAULT
-- PRIVILEGES, so RLS alone is not enough: revoke the table privileges too.
REVOKE ALL ON TABLE public.visitor_sessions FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.page_views       FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.click_events     FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.rage_clicks      FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.dead_clicks      FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.scroll_heatmap   FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.custom_events    FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.session_events   FROM anon, authenticated, PUBLIC;

GRANT ALL ON TABLE public.visitor_sessions TO service_role;
GRANT ALL ON TABLE public.page_views       TO service_role;
GRANT ALL ON TABLE public.click_events     TO service_role;
GRANT ALL ON TABLE public.rage_clicks      TO service_role;
GRANT ALL ON TABLE public.dead_clicks      TO service_role;
GRANT ALL ON TABLE public.scroll_heatmap   TO service_role;
GRANT ALL ON TABLE public.custom_events    TO service_role;
GRANT ALL ON TABLE public.session_events   TO service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- Atomic counters (PostgREST has no increment expression — use RPC)
-- ════════════════════════════════════════════════════════════════════════════

-- Bump page/click counts. Bounce is DERIVED (<= 1 page view), never guessed,
-- so it stays correct even if the unload beacon is lost.
CREATE OR REPLACE FUNCTION public.bump_session_activity(
  p_session_id text,
  p_pages  integer DEFAULT 0,
  p_clicks integer DEFAULT 0
) RETURNS void AS $$
BEGIN
  UPDATE public.visitor_sessions
  SET page_count  = coalesce(page_count, 0)  + p_pages,
      click_count = coalesce(click_count, 0) + p_clicks,
      is_bounce   = (coalesce(page_count, 0) + p_pages <= 1),
      last_active = now()
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Increment a scroll-depth bucket without a read-modify-write race.
CREATE OR REPLACE FUNCTION public.bump_scroll_heatmap(
  p_path   text,
  p_bucket integer,
  p_date   date
) RETURNS void AS $$
BEGIN
  INSERT INTO public.scroll_heatmap (page_path, bucket, date, reach_count)
  VALUES (p_path, p_bucket, p_date, 1)
  ON CONFLICT (page_path, bucket, date)
  DO UPDATE SET reach_count = public.scroll_heatmap.reach_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- SECURITY DEFINER functions are executable by PUBLIC by default; lock down.
REVOKE EXECUTE ON FUNCTION public.bump_session_activity(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_scroll_heatmap(text, integer, date)       FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.bump_session_activity(text, integer, integer) TO service_role;
GRANT  EXECUTE ON FUNCTION public.bump_scroll_heatmap(text, integer, date)       TO service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- Convenience views for ad-hoc SQL in the Supabase editor
-- ════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW public.visitor_daily_summary AS
SELECT
  started_at::date                                          AS date,
  COUNT(*)                                                  AS total_sessions,
  COUNT(*) FILTER (WHERE is_bounce)                         AS bounce_sessions,
  ROUND(AVG(NULLIF(duration_sec, 0)), 1)                    AS avg_duration_sec,
  ROUND(AVG(NULLIF(page_count, 0)), 1)                      AS avg_pages_per_session,
  ROUND(AVG(NULLIF(click_count, 0)), 1)                     AS avg_clicks_per_session,
  COUNT(*) FILTER (WHERE device_type = 'mobile')            AS mobile_sessions,
  COUNT(*) FILTER (WHERE device_type = 'desktop')           AS desktop_sessions,
  COUNT(*) FILTER (WHERE device_type = 'tablet')            AS tablet_sessions,
  COUNT(*) FILTER (WHERE converted)                         AS conversions
FROM public.visitor_sessions
GROUP BY started_at::date
ORDER BY started_at::date DESC;

CREATE OR REPLACE VIEW public.page_daily_summary AS
SELECT
  entered_at::date       AS date,
  path,
  COUNT(*)               AS views,
  ROUND(AVG(NULLIF(duration_sec, 0)), 1)  AS avg_duration_sec,
  ROUND(AVG(NULLIF(scroll_depth, 0)), 1)  AS avg_scroll_depth,
  COUNT(*) FILTER (WHERE is_exit)         AS exits
FROM public.page_views
GROUP BY entered_at::date, path
ORDER BY entered_at::date DESC, views DESC;

-- Click heatmap aggregated into a 10px grid.
CREATE OR REPLACE VIEW public.click_heatmap_summary AS
SELECT
  page_path,
  (click_x / 10) * 10       AS grid_x,
  (click_y / 10) * 10       AS grid_y,
  COUNT(*)                  AS click_count,
  COUNT(*) FILTER (WHERE NOT is_interactive) AS dead_click_count
FROM public.click_events
GROUP BY page_path, (click_x / 10) * 10, (click_y / 10) * 10
ORDER BY page_path, COUNT(*) DESC;

-- Views run with the OWNER's privileges in Supabase, so table RLS does not
-- protect them. Revoke explicitly from anon/authenticated.
REVOKE ALL ON public.visitor_daily_summary FROM anon, authenticated, PUBLIC;
REVOKE ALL ON public.page_daily_summary    FROM anon, authenticated, PUBLIC;
REVOKE ALL ON public.click_heatmap_summary FROM anon, authenticated, PUBLIC;
GRANT  SELECT ON public.visitor_daily_summary TO service_role;
GRANT  SELECT ON public.page_daily_summary    TO service_role;
GRANT  SELECT ON public.click_heatmap_summary TO service_role;
