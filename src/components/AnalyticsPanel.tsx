"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnalyticsPanel() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const getDateString = (date: Date) => date.toISOString().slice(0, 10);
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [since, setSince] = useState(() => getDateString(yesterday));
  const [until, setUntil] = useState(() => getDateString(today));
  const [fetching, setFetching] = useState(false);

  const fetchRange = async (from: string, to: string) => {
    try {
      setFetching(true);
      setError(null);
      const qs = `?since=${encodeURIComponent(from)}&until=${encodeURIComponent(to)}`;
      const res = await fetch(`/api/cloudflare-analytics${qs}`);
      const json = await res.json();
      if (!json || !json.success) {
        const details = Array.isArray(json?.details) ? json.details.join(' | ') : json?.details;
        setError(`${json?.error || 'Failed to fetch analytics'}${details ? `: ${details}` : ''}`);
        setDebugInfo(JSON.stringify(json, null, 2));
        setGroups([]);
        setDashboard(null);
        return;
      }
      const dashboardData = json?.dashboard?.result || json?.dashboard || null;
      const groups = dashboardData?.timeseries || json?.gql?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
      setSince(from);
      setUntil(to);
      setGroups(groups.length ? groups : []);
      setDashboard(dashboardData);
      setDebugInfo(null);
    } catch (err: any) {
      setError(err?.message || 'Network error');
      setGroups([]);
      setDashboard(null);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRange(since, until);
  }, []);

  if (loading) return <div className="text-center text-gray-600">Loading analytics…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Support both flattened structure (from dashboard.timeseries) and raw GraphQL structure
  const labels = groups.map((g: any) => g.date || g.dimensions?.date || '');
  const requests = groups.map((g: any) => g.requests ?? g.sum?.requests ?? 0);
  const pageViews = groups.map((g: any) => g.pageViews ?? g.sum?.pageViews ?? 0);
  const bytes = groups.map((g: any) => g.bytes ?? g.sum?.bytes ?? 0);

  const totalRequests = requests.reduce((a: number, b: number) => a + b, 0);
  const totalPageViews = pageViews.reduce((a: number, b: number) => a + b, 0);
  const totalBytes = bytes.reduce((a: number, b: number) => a + b, 0);
  const totalVisitsFromGroups = groups.reduce((sum: number, group: any) => sum + (group.uniques ?? group?.uniq?.uniques ?? 0), 0);
  // Security & top lists (safely extracted)
  const totals = dashboard?.totals?.[0] || dashboard?.totals || null;
  const totalVisits = totals?.visits ?? totals?.uniques ?? totalVisitsFromGroups;
  const threatsBlocked = totals?.security?.threats?.blocked ?? totals?.threats?.blocked ?? null;
  const botTraffic = totals?.requests?.bot ?? totals?.botRequests ?? null;
  const ddosBlocked = totals?.security?.ddos?.attacksBlocked ?? totals?.ddos?.attacks_blocked ?? null;

  const topCountries = dashboard?.top_countries || [];
  const topPages = dashboard?.top_urls || [];
  const topBots = dashboard?.top_bots || [];

  const hasAnalyticsData = Boolean(
    groups?.length ||
    totalVisits ||
    totalRequests ||
    totalPageViews ||
    totalBytes ||
    threatsBlocked != null ||
    botTraffic != null ||
    ddosBlocked != null ||
    topCountries?.length ||
    topPages?.length ||
    topBots?.length
  );

  if (!hasAnalyticsData) return <div className="text-gray-600">No analytics data available for this range. Check your Cloudflare zone ID and API token.</div>;

  const data = {
    labels,
    datasets: [
      {
        label: 'Requests',
        data: requests,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(16,163,127,0.05)',
        tension: 0.2,
        pointRadius: 3,
      },
      {
        label: 'Page Views',
        data: pageViews,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.05)',
        tension: 0.2,
        pointRadius: 3,
      }
    ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true }, ticks: { beginAtZero: true } }
    }
  };

  const setQuickRange = async (days: number) => {
    const to = new Date();
    const fromDate = new Date(Date.now() - (days === 1 ? 24 * 60 * 60 * 1000 : (days - 1) * 24 * 60 * 60 * 1000));
    const from = fromDate.toISOString().slice(0, 10);
    const toDate = to.toISOString().slice(0, 10);
    await fetchRange(from, toDate);
  };

  return (
    <div className="space-y-4">
      {debugInfo && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <div className="font-semibold mb-2">Cloudflare analytics debug data:</div>
          <pre className="whitespace-pre-wrap break-words text-xs max-h-64 overflow-auto">{debugInfo}</pre>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="analytics-since" className="text-sm text-gray-600">From</label>
          <input id="analytics-since" type="date" value={since} onChange={e => setSince(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="analytics-until" className="text-sm text-gray-600">To</label>
          <input id="analytics-until" type="date" value={until} onChange={e => setUntil(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => fetchRange(since, until)} disabled={fetching} className="ml-0 sm:ml-2 bg-green-600 text-white px-3 py-1.5 rounded text-sm">
            {fetching ? 'Fetching…' : 'Apply'}
          </button>
          <button onClick={() => setQuickRange(1)} disabled={fetching} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200">
            24h
          </button>
          <button onClick={() => setQuickRange(7)} disabled={fetching} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200">
            7d
          </button>
          <button onClick={() => setQuickRange(30)} disabled={fetching} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200">
            30d
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border flex flex-col">
          <div className="text-sm text-gray-500">Requests</div>
          <div className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border flex flex-col">
          <div className="text-sm text-gray-500">Visits</div>
          <div className="text-2xl font-bold text-gray-900">{Number(totalVisits || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border flex flex-col">
          <div className="text-sm text-gray-500">Page Views</div>
          <div className="text-2xl font-bold text-gray-900">{totalPageViews.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border flex flex-col">
          <div className="text-sm text-gray-500">Bandwidth (MB)</div>
          <div className="text-2xl font-bold text-gray-900">{(totalBytes / 1024 / 1024).toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Threats Blocked</div>
          <div className="text-xl font-bold text-gray-900">{threatsBlocked != null ? Number(threatsBlocked).toLocaleString() : 'N/A'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Bot Traffic</div>
          <div className="text-xl font-bold text-gray-900">{botTraffic != null ? Number(botTraffic).toLocaleString() : 'N/A'}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Daily breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {groups.map((g: any) => {
            const dateKey = g.date || g.dimensions?.date;
            return (
              <div key={dateKey} className="p-3 rounded-lg bg-gray-50 border">
                <div className="text-xs text-gray-500">{dateKey}</div>
                <div className="text-sm font-medium text-gray-900">Requests: {Number(g.requests ?? g.sum?.requests ?? 0).toLocaleString()}</div>
                <div className="text-sm text-gray-700">Page Views: {Number(g.pageViews ?? g.sum?.pageViews ?? 0).toLocaleString()}</div>
                <div className="text-sm text-gray-700">Bandwidth: {(Number(g.bytes ?? g.sum?.bytes ?? 0) / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2">Top Countries</h4>
          {topCountries && topCountries.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {topCountries.slice(0, 10).map((c: any, i: number) => {
                const name = Array.isArray(c) ? c[0] : c?.country || c?.name || 'Unknown';
                const count = Array.isArray(c) ? c[1] : c?.count || c?.requests || 0;
                return <li key={i} className="flex justify-between"><span>{name}</span><span className="text-gray-500">{Number(count).toLocaleString()}</span></li>;
              })}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No country data</div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2">Top Pages</h4>
          {topPages && topPages.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700 break-words">
              {topPages.slice(0, 10).map((p: any, i: number) => {
                const url = Array.isArray(p) ? p[0] : p?.path || p?.uri || p?.url || '/';
                const count = Array.isArray(p) ? p[1] : p?.count || p?.requests || 0;
                return <li key={i} className="flex justify-between"><span className="truncate max-w-[70%]">{url}</span><span className="text-gray-500">{Number(count).toLocaleString()}</span></li>;
              })}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No page data</div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2">Top Bot Types</h4>
          {topBots && topBots.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {topBots.slice(0, 8).map((b: any, i: number) => {
                const name = b?.name || (Array.isArray(b) ? b[0] : b?.label || 'Unknown');
                const count = b?.requests ?? b?.count ?? (Array.isArray(b) ? b[1] : null);
                return <li key={i} className="flex justify-between"><span>{name}</span><span className="text-gray-500">{count != null ? Number(count).toLocaleString() : '—'}</span></li>;
              })}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No bot data</div>
          )}
        </div>
      </div>
    </div>
  );
}
