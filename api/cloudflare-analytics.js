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
  query ZoneAnalytics($zoneTag: String!, $start: String!, $end: String!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        httpRequests1dGroups(
          limit: 7
          orderBy: [date_DESC]
          filter: { date_geq: $start, date_leq: $end }
        ) {
          dimensions { date }
          sum { requests pageViews bytes }
        }
      }
    }
  }
  `;

  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    // 1) GraphQL timeseries (last 7 days)
    const gqlResp = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          zoneTag: zoneId,
          start: startDate,
          end: endDate
        }
      })
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

    // 2) Dashboard replacement using Cloudflare GraphQL (replaces deprecated REST dashboard endpoint)
    const q = req.query || {};
    const sinceParam = q.since || q.from || null;
    const untilParam = q.until || q.to || null;
    const since = sinceParam ? new Date(sinceParam).toISOString() : new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    const until = untilParam ? new Date(untilParam).toISOString() : new Date().toISOString();

    // GraphQL query to fetch totals, timeseries and top lists (countries, urls, bots)
    const dashboardQuery = `
    query ZoneDashboard($zoneTag: String!, $start: Time!, $end: Time!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          totals: httpRequestsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end }, limit: 1) {
            sum { requests bytes cachedRequests cachedBytes pageViews }
          }
          timeseries: httpRequestsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end }, limit: 100, orderBy: [datetime_DESC]) {
            dimensions { datetime }
            sum { requests bytes pageViews cachedRequests cachedBytes }
          }
          topCountries: httpRequestsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end }, limit: 10, orderBy: [sum_requests_DESC]) {
            dimensions { clientCountryName }
            sum { requests }
          }
          topUrls: httpRequestsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end }, limit: 10, orderBy: [sum_requests_DESC]) {
            dimensions { clientRequestPath }
            sum { requests }
          }
          topBots: httpRequestsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end }, limit: 10, orderBy: [sum_requests_DESC]) {
            dimensions { clientDeviceType clientBotLabel }
            sum { requests }
          }
          firewall: firewallEventsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end }, limit: 1) { count }
        }
      }
    }
    `;

    const dashGqlResp = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: dashboardQuery, variables: { zoneTag: zoneId, start: since, end: until } })
    });
    const dashGqlData = await dashGqlResp.json();

    // Map GraphQL shape into a dashboard-like object expected by the frontend
    const z = dashGqlData?.data?.viewer?.zones?.[0] || {};
    const totalsSum = z?.totals?.[0]?.sum || {};
    const timeseries = (z?.timeseries || []).map(t => ({
      datetime: t?.dimensions?.datetime,
      sum: t?.sum
    }));
    const top_countries = (z?.topCountries || []).map(tc => [tc?.dimensions?.clientCountryName || 'Unknown', tc?.sum?.requests || 0]);
    const top_urls = (z?.topUrls || []).map(u => [u?.dimensions?.clientRequestPath || 'Unknown', u?.sum?.requests || 0]);
    const top_bots = (z?.topBots || []).map(b => [b?.dimensions?.clientBotLabel || b?.dimensions?.clientDeviceType || 'Bot', b?.sum?.requests || 0]);

    const dashData = {
      totals: [{
        requests: totalsSum.requests || 0,
        bytes: totalsSum.bytes || 0,
        cachedRequests: totalsSum.cachedRequests || 0,
        cachedBytes: totalsSum.cachedBytes || 0,
        pageViews: totalsSum.pageViews || 0,
      }],
      timeseries: [{ top_countries, top_urls, top_bots }],
      top_countries,
      top_urls,
      top_bots,
      firewall: z?.firewall || null,
      raw: dashGqlData
    };

    const errors = [];
    if (gqlData?.errors?.length) errors.push(...gqlData.errors.map(e => e.message || JSON.stringify(e)));
    if (dashGqlData?.errors?.length) errors.push(...dashGqlData.errors.map(e => e.message || JSON.stringify(e)));

    const success = zoneList.length > 0 && Boolean(!gqlData?.errors && !dashGqlData?.errors);
    if (!success) {
      console.error('Cloudflare analytics fetch error', { gqlData, dashGqlData, dashData });
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
