import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler,
);

const GREEN = '#17AD10';
const BROWN = '#8b5e47';
const BLUE = '#2563eb';

type Tab = 'overview' | 'heatmaps' | 'funnel' | 'sessions' | 'live' | 'frustration';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'heatmaps', label: 'Heatmaps' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'live', label: 'Live' },
  { id: 'frustration', label: 'Frustration' },
];

const getDateString = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => getDateString(new Date(Date.now() - n * 86_400_000));
const fmtDuration = (s: number) => {
  if (!s || s < 0) return '0s';
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m < 60) return `${m}m ${sec}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};
const fmtTime = (iso: string) => {
  try { return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
};

function Card({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
      <div className="text-xs sm:text-sm text-gray-500">{label}</div>
      <div className="text-xl sm:text-2xl font-bold mt-1" style={{ color: accent || '#111827' }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function VisitorAnalyticsPanel() {
  const [tab, setTab] = useState<Tab>('overview');
  const [since, setSince] = useState(() => daysAgo(6));
  const [until, setUntil] = useState(() => daysAgo(0));
  const [draftSince, setDraftSince] = useState(since);
  const [draftUntil, setDraftUntil] = useState(until);

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Heatmap tab state
  const [heatmapPath, setHeatmapPath] = useState('/');
  const [heatmap, setHeatmap] = useState<any>(null);
  const [heatmapLoading, setHeatmapLoading] = useState(false);

  // Funnel tab
  const [funnel, setFunnel] = useState<any>(null);

  // Sessions tab
  const [sessions, setSessions] = useState<any[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [recording, setRecording] = useState<any>(null);

  // Live tab
  const [live, setLive] = useState<any>(null);

  // Frustration tab
  const [frustration, setFrustration] = useState<any>(null);

  const qs = useCallback(() => `since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`, [since, until]);

  const call = useCallback(async (action: string, extra = '') => {
    const res = await fetch(`/api/visitor-tracking?action=${action}&${qs()}${extra}`);
    const json = await res.json();
    if (!json?.success) throw new Error(json?.error || `Failed to load ${action}`);
    return json;
  }, [qs]);

  // ── Load core summary whenever range changes ───────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await call('summary');
        if (!cancelled) setSummary(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [call]);

  // ── Load tab-specific data lazily ──────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    (async () => {
      try {
        if (tab === 'funnel') {
          const d = await call('funnel');
          if (!cancelled) setFunnel(d.funnel);
        } else if (tab === 'sessions') {
          const d = await call('recent', '&limit=50');
          if (!cancelled) setSessions(d.sessions || []);
        } else if (tab === 'frustration') {
          const [r, dc] = await Promise.all([call('rage_clicks'), call('dead_clicks')]);
          if (!cancelled) setFrustration({ rage: r.rage_clicks || [], dead: dc.dead_clicks || [] });
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, call, loading]);

  // ── Heatmap data ───────────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'heatmaps') return;
    let cancelled = false;
    (async () => {
      setHeatmapLoading(true);
      try {
        const d = await call('heatmap', `&path=${encodeURIComponent(heatmapPath)}`);
        if (!cancelled) setHeatmap(d);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setHeatmapLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, heatmapPath, call]);

  // ── Live auto-refresh ──────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'live') return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/visitor-tracking?action=live');
        const json = await res.json();
        if (!cancelled && json?.success) setLive(json);
      } catch { /* keep last snapshot */ }
    };
    load();
    const id = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(id); };
  }, [tab]);

  const applyRange = () => {
    if (draftSince > draftUntil) { setError('"From" must be before "To".'); return; }
    setSince(draftSince);
    setUntil(draftUntil);
  };

  const totals = summary?.totals || {};
  const breakdowns = summary?.breakdowns || {};
  const timeseries = summary?.timeseries || [];
  const topPages: any[] = summary?.top_pages || [];

  const lineData = useMemo(() => ({
    labels: timeseries.map((d: any) => d.date?.slice(5) || ''),
    datasets: [
      { label: 'Sessions', data: timeseries.map((d: any) => d.sessions), borderColor: GREEN, backgroundColor: 'rgba(23,173,16,0.08)', fill: true, tension: 0.25, pointRadius: 3 },
      { label: 'Bounces', data: timeseries.map((d: any) => d.bounces), borderColor: '#f59e0b', backgroundColor: 'transparent', tension: 0.25, pointRadius: 2 },
      { label: 'Conversions', data: timeseries.map((d: any) => d.conversions), borderColor: BLUE, backgroundColor: 'transparent', tension: 0.25, pointRadius: 2 },
    ],
  }), [timeseries]);

  const chartOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  // ── Date controls (shared across tabs) ─────────────────────────────────
  const dateControls = (
    <div className="flex flex-wrap items-end gap-2 mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">From</label>
        <input type="date" value={draftSince} onChange={e => setDraftSince(e.target.value)}
          className="border rounded px-2 py-1.5 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">To</label>
        <input type="date" value={draftUntil} onChange={e => setDraftUntil(e.target.value)}
          className="border rounded px-2 py-1.5 text-sm" />
      </div>
      <button onClick={applyRange} disabled={loading}
        className="text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
        style={{ backgroundColor: GREEN }}>
        {loading ? 'Loading…' : 'Apply'}
      </button>
      <button onClick={() => { const f = daysAgo(0), t = daysAgo(0); setDraftSince(f); setDraftUntil(t); setSince(f); setUntil(t); }}
        className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded text-sm text-gray-700">Today</button>
      <button onClick={() => { const f = daysAgo(6), t = daysAgo(0); setDraftSince(f); setDraftUntil(t); setSince(f); setUntil(t); }}
        className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded text-sm text-gray-700">7d</button>
      <button onClick={() => { const f = daysAgo(29), t = daysAgo(0); setDraftSince(f); setDraftUntil(t); setSince(f); setUntil(t); }}
        className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded text-sm text-gray-700">30d</button>
      <span className="ml-auto text-xs text-gray-400">Data from your own Supabase · no third party</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-sm font-semibold" style={{ color: BROWN }}>Visitor Analytics</h3>
        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded">Self-hosted</span>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 flex-wrap border-b border-gray-200">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}>
            {t.label}
            {t.id === 'live' && live?.active_count > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] text-white bg-red-500 rounded-full">{live.active_count}</span>
            )}
          </button>
        ))}
      </div>

      {dateControls}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Could not load analytics:</strong> {error}
          {error.includes('relation') || error.includes('does not exist') ? (
            <div className="mt-2 text-xs">
              The tracking tables are missing. Run{' '}
              <code className="bg-red-100 px-1 rounded">supabase/migrations/20261105000001_create_visitor_tracking.sql</code>{' '}
              in the Supabase SQL editor — Vercel does not apply migrations automatically.
            </div>
          ) : null}
        </div>
      )}

      {loading && !summary && <div className="text-center text-gray-500 py-10 text-sm">Loading visitor data…</div>}

      {/* ═══════════════════ OVERVIEW ═══════════════════ */}
      {tab === 'overview' && summary && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <Card label="Sessions" value={Number(totals.sessions || 0).toLocaleString()} sub={`${totals.bot_sessions || 0} bots filtered`} />
            <Card label="Active right now" value={Number(totals.active_now || 0).toLocaleString()} sub="last 5 minutes" accent={GREEN} />
            <Card label="Bounce rate" value={`${totals.bounce_rate || 0}%`} sub="single-page sessions" />
            <Card label="Avg. time on site" value={fmtDuration(totals.avg_duration_sec)} sub={`${totals.avg_pages_per_session || 0} pages / session`} />
            <Card label="Page views / session" value={totals.avg_pages_per_session || 0} sub={`${totals.avg_clicks_per_session || 0} clicks / session`} />
            <Card label="Conversions" value={Number(totals.conversions || 0).toLocaleString()} sub={`${totals.conversion_rate || 0}% conversion rate`} accent={BLUE} />
            <Card label="Rage clicks" value={Number(totals.rage_clicks || 0).toLocaleString()} sub="frustration signals" accent="#dc2626" />
            <Card label="Dead clicks" value={Number(totals.dead_clicks || 0).toLocaleString()} sub="clicks that did nothing" accent="#f59e0b" />
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Sessions, bounces &amp; conversions</h4>
            <div className="h-[260px]"><Line data={lineData} options={chartOptions} /></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Top pages</h4>
              {topPages.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-gray-500 border-b">
                      <th className="pb-2">Page</th><th className="pb-2 text-right">Views</th>
                      <th className="pb-2 text-right">Avg time</th><th className="pb-2 text-right">Scroll</th>
                      <th className="pb-2 text-right">Exit</th>
                    </tr></thead>
                    <tbody>
                      {topPages.slice(0, 12).map((p: any) => (
                        <tr key={p.path} className="border-b border-gray-50 last:border-0">
                          <td className="py-1.5 pr-2 truncate max-w-[160px]" title={p.path}>{p.path}</td>
                          <td className="py-1.5 text-right font-medium">{p.views}</td>
                          <td className="py-1.5 text-right text-gray-600">{fmtDuration(p.avg_duration_sec)}</td>
                          <td className="py-1.5 text-right text-gray-600">{p.avg_scroll_depth}%</td>
                          <td className="py-1.5 text-right text-gray-600">{p.exit_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div className="text-sm text-gray-500">No page views in this range.</div>}
            </div>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Audience breakdown</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Devices</div>
                    {Object.entries(breakdowns.devices || {}).map(([k, v]: any) => (
                      <div key={k} className="flex justify-between"><span className="capitalize text-gray-700">{k}</span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Browsers</div>
                    {Object.entries(breakdowns.browsers || {}).map(([k, v]: any) => (
                      <div key={k} className="flex justify-between"><span className="capitalize text-gray-700">{k}</span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Top countries</div>
                    {(breakdowns.countries || []).slice(0, 5).map((c: any) => (
                      <div key={c.country} className="flex justify-between"><span className="text-gray-700">{c.country}</span><span className="font-medium">{c.count}</span></div>
                    ))}
                    {!(breakdowns.countries || []).length && <span className="text-xs text-gray-400">Vercel GeoIP populates on deploy</span>}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Top referrers</div>
                    {(summary.top_referrers || []).slice(0, 5).map((r: any) => (
                      <div key={r.host} className="flex justify-between"><span className="truncate max-w-[110px] text-gray-700">{r.host}</span><span className="font-medium">{r.count}</span></div>
                    ))}
                    {!(summary.top_referrers || []).length && <span className="text-xs text-gray-400">No external referrers</span>}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Custom events</h4>
                {(summary.custom_events || []).length ? (
                  <div className="space-y-1.5 text-sm">
                    {summary.custom_events.map((e: any) => (
                      <div key={e.name} className="flex justify-between"><span className="text-gray-700">{e.name}</span><span className="font-medium" style={{ color: GREEN }}>{e.count}</span></div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 leading-relaxed">
                    No conversion events yet. Call{' '}
                    <code className="bg-gray-100 px-1 rounded">trackCustomEvent('order_placed')</code>{' '}
                    from <code className="bg-gray-100 px-1 rounded">src/lib/visitorTracking.ts</code> in your
                    checkout, signup and contact-form handlers.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ HEATMAPS ═══════════════════ */}
      {tab === 'heatmaps' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <label className="text-sm font-medium text-gray-700">Page:</label>
              <select value={heatmapPath} onChange={e => setHeatmapPath(e.target.value)}
                className="border rounded px-2 py-1.5 text-sm max-w-full">
                {Array.from(new Set(['/', ...topPages.map((p: any) => p.path)])).map((p: any) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <span className="text-xs text-gray-500">
                {heatmapLoading ? 'Loading…' : `${heatmap?.click_count || 0} clicks recorded`}
              </span>
              <span className="ml-auto text-xs text-gray-400">Red = many clicks · Blue = few</span>
            </div>

            {/* Click heatmap — viewport-relative overlay */}
            <div className="relative w-full rounded-lg border border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden"
              style={{ height: 420 }}>
              <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              {(heatmap?.clicks || []).map((c: any, i: number) => {
                const maxW = Math.max(1440, ...(heatmap?.clicks || []).map((x: any) => x.viewport_width || 1440));
                const maxH = Math.max(900, ...(heatmap?.clicks || []).map((x: any) => x.viewport_height || 900));
                const left = Math.min(98, Math.max(2, ((c.click_x || 0) / maxW) * 100));
                const top = Math.min(98, Math.max(2, ((c.click_y || 0) / maxH) * 100));
                return (
                  <div key={i}
                    className="absolute rounded-full pointer-events-none"
                    title={`${c.tag_name || 'click'} at ${c.click_x},${c.click_y}`}
                    style={{
                      left: `${left}%`, top: `${top}%`, width: 22, height: 22,
                      transform: 'translate(-50%, -50%)',
                      background: c.is_interactive === false
                        ? 'radial-gradient(circle, rgba(245,158,11,0.55) 0%, rgba(245,158,11,0) 70%)'
                        : 'radial-gradient(circle, rgba(220,38,38,0.35) 0%, rgba(220,38,38,0) 70%)',
                    }} />
                );
              })}
              {(heatmap?.clicks || []).length === 0 && !heatmapLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                  No clicks on this page yet in the selected range.
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 bg-white/70 px-1.5 py-0.5 rounded">
                Viewport overlay · {heatmapPath}
              </div>
            </div>
          </div>

          {/* Scroll heatmap */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Scroll depth — how far visitors get</h4>
            {(() => {
              const buckets = [0, 1, 2, 3].map(b => ({
                label: ['0–25%', '25–50%', '50–75%', '75–100%'][b],
                count: (heatmap?.scroll_buckets || []).filter((s: any) => s.bucket === b).reduce((a: number, s: any) => a + s.reach_count, 0),
              }));
              const max = Math.max(1, ...buckets.map(b => b.count));
              return (
                <div className="space-y-2">
                  {buckets.map(b => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-16">{b.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className="h-full rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-medium transition-all"
                          style={{ width: `${Math.max(b.count ? 4 : 0, (b.count / max) * 100)}%`, backgroundColor: GREEN }}>
                          {b.count > 0 ? b.count : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
            <p className="text-xs text-gray-400 mt-3">
              Bucket counts are incremental: each session is counted once per depth milestone reached.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════ FUNNEL ═══════════════════ */}
      {tab === 'funnel' && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Shop conversion funnel</h4>
          <p className="text-xs text-gray-500 mb-4">
            Unique sessions at each step of the real <code className="bg-gray-100 px-1 rounded">/shop</code> flow:
            landing → browse → product → checkout → confirmation. This is the analysis
            Clarity cannot do — it has raw sessions, not a business-defined funnel.
          </p>
          {funnel?.length ? (
            <>
              <div className="space-y-2">
                {funnel.map((f: any, i: number) => {
                  const max = Math.max(1, ...funnel.map((x: any) => x.count));
                  return (
                    <div key={f.stage} className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm text-gray-700 w-24 sm:w-32 capitalize">{f.stage.replace(/_/g, ' ')}</span>
                      <div className="flex-1 bg-gray-100 rounded h-8 relative overflow-hidden">
                        <div className="h-full rounded flex items-center px-2 text-xs text-white font-medium"
                          style={{ width: `${Math.max(f.count ? 6 : 0, (f.count / max) * 100)}%`, backgroundColor: i === funnel.length - 1 ? BLUE : GREEN }}>
                          {f.count}
                        </div>
                      </div>
                      <span className={`text-xs w-20 text-right ${f.drop_off_rate > 50 ? 'text-red-600' : 'text-gray-500'}`}>
                        {i === 0 ? '—' : `−${f.drop_off_rate}% drop`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : <div className="text-sm text-gray-500 py-6 text-center">No funnel data in this range yet.</div>}
        </div>
      )}

      {/* ═══════════════════ SESSIONS / REPLAY ═══════════════════ */}
      {tab === 'sessions' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold text-gray-800">Recent sessions</h4>
            <p className="text-xs text-gray-500 mt-0.5">Click a session to replay its event timeline.</p>
          </div>
          {sessions.length ? (
            <div className="divide-y divide-gray-100">
              {sessions.map((s: any) => (
                <div key={s.id}>
                  <button onClick={async () => {
                    if (expandedSession === s.id) { setExpandedSession(null); setRecording(null); return; }
                    setExpandedSession(s.id);
                    try {
                      const res = await fetch(`/api/visitor-tracking?action=recordings&sessionId=${encodeURIComponent(s.id)}&${qs()}`);
                      const json = await res.json();
                      setRecording(json.success ? json : null);
                    } catch { setRecording(null); }
                  }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="font-mono text-xs text-gray-400 w-28 truncate">{s.id}</span>
                    <span className="text-xs text-gray-500 w-32">{fmtTime(s.started_at)}</span>
                    <span className="text-gray-800 font-medium">{s.entry_path}</span>
                    <span className="text-xs text-gray-500">{s.page_count || 0} pages · {s.click_count || 0} clicks</span>
                    <span className="text-xs text-gray-500">{fmtDuration(s.duration_sec)}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{s.device_type}</span>
                    {s.country && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{s.country}</span>}
                    {s.converted && <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700">converted</span>}
                    {s.is_bot && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">bot</span>}
                    <span className="ml-auto text-gray-400">{expandedSession === s.id ? '▾' : '▸'}</span>
                  </button>

                  {expandedSession === s.id && (
                    <div className="px-4 pb-4 bg-gray-50">
                      {!recording ? (
                        <div className="text-sm text-gray-500 py-3">Loading timeline…</div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">Page journey</h5>
                            <ol className="space-y-1.5">
                              {(recording.page_views || []).map((pv: any, i: number) => (
                                <li key={pv.id} className="text-xs flex items-start gap-2">
                                  <span className="w-5 h-5 flex-shrink-0 rounded-full text-white text-[10px] flex items-center justify-center"
                                    style={{ backgroundColor: GREEN }}>{i + 1}</span>
                                  <span className="text-gray-800 break-all">{pv.path}</span>
                                  <span className="text-gray-400 ml-auto whitespace-nowrap">
                                    {pv.duration_sec ? fmtDuration(pv.duration_sec) : '—'} · {pv.scroll_depth || 0}%
                                  </span>
                                </li>
                              ))}
                              {!(recording.page_views || []).length && <li className="text-xs text-gray-500">No page views.</li>}
                            </ol>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">
                              Event timeline ({recording.events?.length || 0} events)
                            </h5>
                            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                              {(recording.events || []).map((ev: any) => (
                                <div key={ev.id} className="text-xs flex gap-2 border-b border-gray-200 pb-1">
                                  <span className="text-gray-400 w-14 flex-shrink-0 font-mono">
                                    +{Math.round((ev.elapsed_ms || 0) / 1000)}s
                                  </span>
                                  <span className="font-medium text-gray-700 w-20 flex-shrink-0">{ev.event_type}</span>
                                  <span className="text-gray-600 truncate">
                                    {ev.event_type === 'click'
                                      ? `${ev.payload?.tag || ''} "${(ev.payload?.text || '').slice(0, 30)}" @ ${ev.payload?.x},${ev.payload?.y}`
                                      : ev.event_type === 'scroll'
                                        ? `${ev.payload?.depth}% depth`
                                        : ev.event_type === 'navigation'
                                          ? `→ ${ev.payload?.to}`
                                          : JSON.stringify(ev.payload || {}).slice(0, 70)}
                                  </span>
                                </div>
                              ))}
                              {!(recording.events || []).length && <div className="text-xs text-gray-500">No events captured.</div>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <div className="text-sm text-gray-500 py-8 text-center">No sessions recorded yet. Visit a public page to generate data.</div>}
        </div>
      )}

      {/* ═══════════════════ LIVE ═══════════════════ */}
      {tab === 'live' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-sm font-semibold text-gray-800">{live?.active_count || 0} visitors active now</span>
            <span className="text-xs text-gray-400">auto-refreshes every 15s</span>
          </div>
          {live?.visitors?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {live.visitors.map((v: any) => (
                <div key={v.id} className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-800">{v.entry_path}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{v.device_type}</span>
                    {v.country && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{v.country}{v.city ? ` · ${v.city}` : ''}</span>}
                    <span className="ml-auto text-xs text-gray-400">{fmtTime(v.last_active)}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {v.page_count || 0} pages · {v.click_count || 0} clicks · here for{' '}
                    {fmtDuration(Math.round((Date.now() - new Date(v.started_at).getTime()) / 1000))}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {(v.page_views || []).slice(-4).map((pv: any, i: number) => (
                      <span key={i} className="text-[11px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{pv.path}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
              No one on the site right now.
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════ FRUSTRATION ═══════════════════ */}
      {tab === 'frustration' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">Rage clicks</h4>
            <p className="text-xs text-gray-500 mb-3">3+ rapid clicks in the same spot — usually a broken control.</p>
            {frustration?.rage?.length ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {frustration.rage.map((r: any) => (
                  <div key={r.id} className="text-xs border-b border-gray-100 pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">{r.page_path}</span>
                      <span className="text-red-600 font-semibold">{r.click_count} clicks</span>
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {r.element_tag} "{r.element_text}" · {fmtTime(r.detected_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-sm text-gray-500 py-4">None detected — good sign.</div>}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">Dead clicks</h4>
            <p className="text-xs text-gray-500 mb-3">Clicks on elements that do nothing — often a design that looks clickable.</p>
            {frustration?.dead?.length ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {frustration.dead.map((d: any) => (
                  <div key={d.id} className="text-xs border-b border-gray-100 pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">{d.page_path}</span>
                      <span className="text-gray-400">{d.click_x},{d.click_y}</span>
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {d.tag_name} "{d.element_text}" · {fmtTime(d.clicked_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-sm text-gray-500 py-4">None detected — good sign.</div>}
          </div>
        </div>
      )}

      {!summary && !loading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600 text-center">
          No visitor data for <strong>{since}</strong> → <strong>{until}</strong>.
          Once the migration is applied and the tracker is deployed, sessions appear here within seconds.
        </div>
      )}
    </div>
  );
}
