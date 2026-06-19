"use client";

import React, { useEffect, useState } from 'react';
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

  const [since, setSince] = useState(() => {
    const d = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  });
  const [until, setUntil] = useState(() => new Date().toISOString().slice(0, 10));
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/cloudflare-analytics');
        const json = await res.json();
        if (!mounted) return;
        if (!json || !json.success) {
          setError(json?.error || 'Failed to fetch analytics');
          setGroups([]);
          setDashboard(null);
        } else {
          const groups = json?.gql?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
          const dashboardData = json?.dashboard?.result || json?.dashboard || null;
          setGroups(groups);
          setDashboard(dashboardData);
        }
      } catch (err: any) {
        setError(err?.message || 'Network error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-center text-gray-600">Loading analytics…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if ((!groups || groups.length === 0) && !dashboard) return <div className="text-gray-600">No analytics data available.</div>;

  const labels = groups.map((g: any) => g.dimensions?.date || '');
  const requests = groups.map((g: any) => g.sum?.requests || 0);
  const pageViews = groups.map((g: any) => g.sum?.pageViews || 0);
  const bytes = groups.map((g: any) => g.sum?.bytes || 0);

  const totalRequests = requests.reduce((a: number, b: number) => a + b, 0);
  const totalPageViews = pageViews.reduce((a: number, b: number) => a + b, 0);
  const totalBytes = bytes.reduce((a: number, b: number) => a + b, 0);
  // Security & top lists (safely extracted)
  const totals = dashboard?.totals?.[0] || dashboard?.totals || null;
  const threatsBlocked = totals?.security?.threats?.blocked ?? totals?.threats?.blocked ?? null;
  const botTraffic = totals?.requests?.bot ?? totals?.botRequests ?? null;
  const cached = totals?.requests?.cached ?? totals?.requests_cached ?? null;
  const allRequests = totals?.requests?.all ?? totals?.requests_all ?? null;
  const cacheHitRatio = (cached && allRequests) ? ((cached / allRequests) * 100) : null;
  const ddosBlocked = totals?.security?.ddos?.attacksBlocked ?? totals?.ddos?.attacks_blocked ?? null;

  const topCountries = dashboard?.timeseries?.[0]?.top_countries || dashboard?.top_countries || dashboard?.topCountries || [];
  const topPages = dashboard?.timeseries?.[0]?.top_urls || dashboard?.top_urls || dashboard?.top_uris || dashboard?.topUrls || [];
  const topBots = dashboard?.top_bots || dashboard?.result?.top_bots || dashboard?.timeseries?.[0]?.top_bots || [];

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

  const fetchRange = async (from: string, to: string) => {
    try {
      setFetching(true);
      setError(null);
      const qs = `?since=${encodeURIComponent(from)}&until=${encodeURIComponent(to)}`;
      const res = await fetch(`/api/cloudflare-analytics${qs}`);
      const json = await res.json();
      if (!json || !json.success) {
        setError(json?.error || 'Failed to fetch analytics');
        return;
      }
      const groups = json?.gql?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
      const dashboardData = json?.dashboard?.result || json?.dashboard || null;
      setGroups(groups.length ? groups : []);
      setDashboard(dashboardData);
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From</label>
          <input type="date" value={since} onChange={e => setSince(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">To</label>
          <input type="date" value={until} onChange={e => setUntil(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <button onClick={() => fetchRange(since, until)} disabled={fetching} className="ml-0 sm:ml-2 bg-green-600 text-white px-3 py-1.5 rounded text-sm">
            {fetching ? 'Fetching…' : 'Apply'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-lg border flex flex-col">
          <div className="text-sm text-gray-500">Requests (last {labels.length} days)</div>
          <div className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border flex flex-col">
          <div className="text-sm text-gray-500">Page Views (last {labels.length} days)</div>
          <div className="text-2xl font-bold text-gray-900">{totalPageViews.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border flex flex-col">
          <div className="text-sm text-gray-500">Bandwidth (MB)</div>
          <div className="text-2xl font-bold text-gray-900">{(totalBytes / 1024 / 1024).toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Threats Blocked</div>
          <div className="text-xl font-bold text-gray-900">{threatsBlocked != null ? Number(threatsBlocked).toLocaleString() : 'N/A'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Bot Traffic</div>
          <div className="text-xl font-bold text-gray-900">{botTraffic != null ? Number(botTraffic).toLocaleString() : 'N/A'}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Cache Hit Ratio</div>
          <div className="text-xl font-bold text-gray-900">{cacheHitRatio != null ? `${cacheHitRatio.toFixed(1)}%` : 'N/A'}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div style={{ height: 300 }}>
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Daily breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {groups.map((g: any) => (
            <div key={g.dimensions?.date} className="p-3 rounded-lg bg-gray-50 border">
              <div className="text-xs text-gray-500">{g.dimensions?.date}</div>
              <div className="text-sm font-medium text-gray-900">Requests: {Number(g.sum?.requests || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-700">Page Views: {Number(g.sum?.pageViews || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-700">Bandwidth: {(Number(g.sum?.bytes || 0) / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2">Top Countries</h4>
          {topCountries && topCountries.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {topCountries.slice(0, 8).map((c: any, i: number) => {
                const name = c?.name || (Array.isArray(c) ? c[0] : c?.country || 'Unknown');
                const count = c?.requests ?? c?.count ?? (Array.isArray(c) ? c[1] : null);
                return <li key={i} className="flex justify-between"><span>{name}</span><span className="text-gray-500">{count != null ? Number(count).toLocaleString() : '—'}</span></li>;
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
              {topPages.slice(0, 8).map((p: any, i: number) => {
                const url = p?.uri || p?.path || (Array.isArray(p) ? p[0] : p?.url || '/');
                const count = p?.requests ?? p?.count ?? (Array.isArray(p) ? p[1] : null);
                return <li key={i} className="flex justify-between"><span className="truncate max-w-[70%]">{url}</span><span className="text-gray-500">{count != null ? Number(count).toLocaleString() : '—'}</span></li>;
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
