import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, isTrackable, trackPageView } from '../lib/analytics';

/**
 * Mounted once inside the router. Renders nothing; its only job is to tell the
 * analytics layer which route the visitor is on, because a single-page app never
 * produces a new document for Clarity to pick up on its own.
 */
export default function AnalyticsTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Deliberately only load on measurable routes. Landing straight on a
    // dashboard must not start a recording of it.
    if (isTrackable(pathname)) initAnalytics();
  }, [pathname]);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
