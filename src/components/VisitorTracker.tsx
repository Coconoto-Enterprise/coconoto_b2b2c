import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  startSession,
  trackPageChange,
  trackClick,
  trackMouseMove,
  trackResize,
  endSession,
  handleVisibilityChange,
  flushQueue,
} from '../lib/visitorTracking';

/**
 * VisitorTracker — mounted once inside the router, above all routes.
 *
 * Full self-hosted analytics. Renders nothing. Captures:
 *   - Session lifecycle (start, page views, exit)
 *   - Click tracking (element, position, dead clicks, rage clicks)
 *   - Mouse movement sampling (cursor heatmaps)
 *   - Scroll depth milestones
 *   - Tab visibility changes
 *   - Viewport resizes
 *   - Session event timeline (for replay)
 *
 * Dashboard routes are excluded — see visitorTracking.ts EXCLUDED_PREFIXES.
 */
export default function VisitorTracker() {
  const { pathname } = useLocation();

  // ── Initial session start ──────────────────────────────────────────────
  useEffect(() => {
    startSession(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Route changes ──────────────────────────────────────────────────────
  useEffect(() => {
    trackPageChange(pathname);
  }, [pathname]);

  // ── Click tracking ─────────────────────────────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => trackClick(e);
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // ── Mouse movement sampling ────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => trackMouseMove(e);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // ── Resize tracking ────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => trackResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Tab visibility ──────────────────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => handleVisibilityChange();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // ── Session end on unload ───────────────────────────────────────────────
  useEffect(() => {
    const onUnload = () => {
      endSession();
      flushQueue();
    };
    const onPageHide = (e: PageTransitionEvent) => {
      endSession();
      flushQueue();
    };

    window.addEventListener('beforeunload', onUnload);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.removeEventListener('beforeunload', onUnload);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);

  // ── Periodic flush safety net ──────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => flushQueue(), 10000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
