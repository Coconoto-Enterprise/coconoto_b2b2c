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
    const since = sinceParam
      ? new Date(sinceParam).toISOString().slice(0, 10)
      : new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const until = untilParam
      ? new Date(untilParam).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    // GraphQL query: Totals aggregated across entire date range (use 1d groups)
    const totalsQuery = `
    query ZoneTotals($zoneTag: String!, $start: String!, $end: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(
            filter: { date_geq: $start, date_leq: $end }
            limit: 1
          ) {
            sum {
              requests
              bytes
              cachedRequests
              cachedBytes
              pageViews
              encryptedRequests
            }
          }
        }
      }
    }
    `;

    // GraphQL query: Timeseries by date (1d buckets)
    const timeseriesQuery = `
    query ZoneTimeseries($zoneTag: String!, $start: String!, $end: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(
            filter: { date_geq: $start, date_leq: $end }
            limit: 100
            orderBy: [date_DESC]
          ) {
            dimensions { date }
            sum {
              requests
              bytes
              pageViews
              cachedRequests
              cachedBytes
            }
          }
        }
      }
    }
    `;

    // GraphQL query: Top countries by request count
    // Use httpRequestsAdaptiveGroups for arbitrary group-by dimensions.
    const topCountriesQuery = `
    query TopCountries($zoneTag: String!, $start: String!, $end: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequestsAdaptiveGroups(
            filter: { date_geq: $start, date_leq: $end }
            limit: 10
            orderBy: [sum_requests_DESC]
          ) {
            dimensions { country: clientCountryName }
            sum { requests }
          }
        }
      }
    }
    `;

    // GraphQL query: Top URLs by request count
    const topUrlsQuery = `
    query TopURLs($zoneTag: String!, $start: String!, $end: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequestsAdaptiveGroups(
            filter: { date_geq: $start, date_leq: $end }
            limit: 10
            orderBy: [sum_requests_DESC]
          ) {
            dimensions { path: clientRequestPath }
            sum { requests }
          }
        }
      }
    }
    `;

    // Execute all queries in parallel
    const [totalsResp, timeseriesResp, countriesResp, urlsResp] = await Promise.all([
      fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: totalsQuery, variables: { zoneTag: zoneId, start: since, end: until } })
      }),
      fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: timeseriesQuery, variables: { zoneTag: zoneId, start: since, end: until } })
      }),
      fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: topCountriesQuery, variables: { zoneTag: zoneId, start: since, end: until } })
      }),
      fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: topUrlsQuery, variables: { zoneTag: zoneId, start: since, end: until } })
      })
    ]);

    const [totalsData, timeseriesData, countriesData, urlsData] = await Promise.all([
      totalsResp.json(),
      timeseriesResp.json(),
      countriesResp.json(),
      urlsResp.json()
    ]);

    // Extract data from each response
    const totalsSum = totalsData?.data?.viewer?.zones?.[0]?.httpRequests1dGroups?.[0]?.sum || {};
    const timeseriesGroups = timeseriesData?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
    const topCountries = (countriesData?.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups || [])
      .map(g => [g?.dimensions?.country || 'Unknown', g?.sum?.requests || 0]);
    const topUrls = (urlsData?.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups || [])
      .map(g => [g?.dimensions?.path || 'Unknown', g?.sum?.requests || 0]);

    // Build dashboard response object
    const dashData = {
      totals: [{
        requests: totalsSum.requests || 0,
        bytes: totalsSum.bytes || 0,
        cachedRequests: totalsSum.cachedRequests || 0,
        cachedBytes: totalsSum.cachedBytes || 0,
        pageViews: totalsSum.pageViews || 0,
        encryptedRequests: totalsSum.encryptedRequests || 0
      }],
      timeseries: timeseriesGroups.map(g => ({
        date: g?.dimensions?.date,
        requests: g?.sum?.requests || 0,
        bytes: g?.sum?.bytes || 0,
        pageViews: g?.sum?.pageViews || 0,
        cachedRequests: g?.sum?.cachedRequests || 0,
        cachedBytes: g?.sum?.cachedBytes || 0
      })),
      top_countries: topCountries,
      top_urls: topUrls,
      raw: { totals: totalsData, timeseries: timeseriesData, countries: countriesData, urls: urlsData }
    };

    // Collect errors from all responses
    const dashGqlData = dashData;

    const errors = [];
    if (gqlData?.errors?.length) errors.push(...gqlData.errors.map(e => e.message || JSON.stringify(e)));
    if (totalsData?.errors?.length) errors.push(...totalsData.errors.map(e => e.message || JSON.stringify(e)));
    if (timeseriesData?.errors?.length) errors.push(...timeseriesData.errors.map(e => e.message || JSON.stringify(e)));
    if (countriesData?.errors?.length) errors.push(...countriesData.errors.map(e => e.message || JSON.stringify(e)));
    if (urlsData?.errors?.length) errors.push(...urlsData.errors.map(e => e.message || JSON.stringify(e)));

    const success = zoneList.length > 0 && !errors.length;
    if (!success) {
      console.error('Cloudflare analytics fetch error', { gqlData, totalsData, timeseriesData, countriesData, urlsData, errors });
      return res.status(500).json({
        success: false,
        error: 'Cloudflare analytics fetch returned errors',
        details: errors.length ? errors : 'Check server logs for details',
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
