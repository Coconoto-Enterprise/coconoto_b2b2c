export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const zoneId = process.env.CLOUDFLARE_ZONE_ID || process.env.VITE_CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.VITE_CLOUDFLARE_API_TOKEN;

  if (!zoneId || !apiToken) {
    return res.status(500).json({ success: false, error: 'Missing Cloudflare credentials' });
  }

  const query = `
  query {
    viewer {
      zones(filter: { zoneTag: "${zoneId}" }) {
        httpRequests1dGroups(limit: 7) {
          dimensions { date }
          sum { requests pageViews bytes }
        }
      }
    }
  }
  `;

  try {
    // 1) GraphQL timeseries (last 7 days)
    const gqlResp = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    const gqlData = await gqlResp.json();

    const zoneList = gqlData?.data?.viewer?.zones || [];
    if (zoneList.length === 0) {
      const zoneError = (gqlData?.errors || []).map(e => e.message || JSON.stringify(e)).join(' | ') ||
        'Cloudflare token is valid but the zone ID was not found or is not accessible with the provided token.';
      console.error('Cloudflare zone lookup failed', { zoneId, gqlData });
      return res.status(500).json({
        success: false,
        error: 'Cloudflare zone lookup failed',
        details: zoneError,
        gql: gqlData
      });
    }

    // 2) Dashboard REST endpoint for security and top lists (accept optional since/until query params)
    const q = req.query || {};
    const sinceParam = q.since || q.from || null;
    const untilParam = q.until || q.to || null;
    const since = sinceParam ? new Date(sinceParam).toISOString() : new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    const until = untilParam ? new Date(untilParam).toISOString() : new Date().toISOString();
    const dashboardUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard?since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`;
    const dashResp = await fetch(dashboardUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiToken}` }
    });
    const dashData = await dashResp.json();

    const success = Boolean(gqlData?.success !== false && dashData?.success !== false && zoneList.length > 0);
    const errors = [];
    if (gqlData?.errors?.length) errors.push(...gqlData.errors.map(e => e.message || JSON.stringify(e)));
    if (dashData?.errors?.length) errors.push(...dashData.errors.map(e => e.message || JSON.stringify(e)));
    if (gqlData?.success === false && gqlData?.errors == null) errors.push('Cloudflare GraphQL query failed');
    if (dashData?.success === false && dashData?.errors == null) errors.push('Cloudflare dashboard query failed');

    if (!success) {
      console.error('Cloudflare analytics fetch error', { gqlData, dashData });
      return res.status(500).json({
        success: false,
        error: 'Cloudflare analytics fetch returned errors',
        details: errors.length ? errors : undefined,
        gql: gqlData,
        dashboard: dashData
      });
    }

    return res.status(200).json({ success: true, gql: gqlData, dashboard: dashData });
  } catch (err) {
    console.error('Cloudflare analytics error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Unknown error' });
  }
}
