export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const zoneId = process.env.CLOUDFLARE_ZONE_ID || process.env.VITE_CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.VITE_CLOUDFLARE_API_TOKEN;

  const formatDateString = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
  };

  const buildDailyIntervals = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endDate) return [];

    const intervals = [];
    const current = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    const last = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

    while (current <= last) {
      intervals.push(current.toISOString().slice(0, 10));
      current.setUTCDate(current.getUTCDate() + 1);
    }

    return intervals;
  };

  const aggregateAdaptiveGroupCounts = (groups, dimensionKey) => {
    const counts = {};
    for (const item of groups || []) {
      const label = item?.dimensions?.[dimensionKey] || 'Unknown';
      const count = item?.count || 0;
      counts[label] = (counts[label] || 0) + count;
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([label, count]) => [label, count]);
  };

  const fetchGraphQL = async (queryText, variables) => {
    const resp = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryText, variables })
    });
    const data = await resp.json();
    return { resp, data };
  };

  const fetchAdaptiveGroups = async (queryText, dimensionKey, startDate, endDate) => {
    const intervals = buildDailyIntervals(startDate, endDate);
    if (!intervals.length) {
      return { aggregated: [], rawResponses: [] };
    }

    const responses = await Promise.all(
      intervals.map(day => fetchGraphQL(queryText, { zoneTag: zoneId, start: day, end: day }))
    );

    const allGroups = responses.flatMap(r => r.data?.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups || []);
    return { aggregated: aggregateAdaptiveGroupCounts(allGroups, dimensionKey), rawResponses: responses };
  };

  const fetchDailyGraphQLResponses = async (queryText, startDate, endDate) => {
    const intervals = buildDailyIntervals(startDate, endDate);
    if (!intervals.length) return [];
    return Promise.all(
      intervals.map(day => fetchGraphQL(queryText, { zoneTag: zoneId, start: day, end: day }))
    );
  };

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

  const queryDate = formatDateString(new Date());

  try {
    // 1) GraphQL zone validation with a single-day range
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
          start: queryDate,
          end: queryDate
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
    const since = formatDateString(sinceParam) || formatDateString(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
    const until = formatDateString(untilParam) || formatDateString(new Date());

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
            orderBy: [count_DESC]
          ) {
            count
            dimensions { country: clientCountryName }
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
            orderBy: [count_DESC]
          ) {
            count
            dimensions { path: clientRequestPath }
          }
        }
      }
    }
    `;

    // Execute totals and timeseries queries using daily chunks to satisfy Cloudflare 1-day limits
    const [totalsResponses, timeseriesResponses, countriesResult, urlsResult] = await Promise.all([
      fetchDailyGraphQLResponses(totalsQuery, since, until),
      fetchDailyGraphQLResponses(timeseriesQuery, since, until),
      fetchAdaptiveGroups(topCountriesQuery, 'country', since, until),
      fetchAdaptiveGroups(topUrlsQuery, 'path', since, until)
    ]);

    const totalsData = totalsResponses.map(r => r.data);
    const timeseriesData = timeseriesResponses.map(r => r.data);
    const countriesData = countriesResult.rawResponses.map(r => r.data);
    const urlsData = urlsResult.rawResponses.map(r => r.data);
    const topCountries = countriesResult.aggregated;
    const topUrls = urlsResult.aggregated;

    // Extract data from each response
    const totalsSum = totalsResponses
      .flatMap(r => r.data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [])
      .reduce((acc, group) => {
        const sum = group?.sum || {};
        return {
          requests: acc.requests + (sum.requests || 0),
          bytes: acc.bytes + (sum.bytes || 0),
          cachedRequests: acc.cachedRequests + (sum.cachedRequests || 0),
          cachedBytes: acc.cachedBytes + (sum.cachedBytes || 0),
          pageViews: acc.pageViews + (sum.pageViews || 0),
          encryptedRequests: acc.encryptedRequests + (sum.encryptedRequests || 0)
        };
      }, { requests: 0, bytes: 0, cachedRequests: 0, cachedBytes: 0, pageViews: 0, encryptedRequests: 0 });

    const timeseriesGroups = timeseriesResponses
      .flatMap(r => r.data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [])
      .sort((a, b) => (a?.dimensions?.date || '').localeCompare(b?.dimensions?.date || ''));
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

    const collectErrors = (payload) => {
      const errorList = [];
      if (!payload) return errorList;
      if (Array.isArray(payload)) {
        for (const item of payload) {
          if (item?.errors?.length) {
            errorList.push(...item.errors.map(e => e.message || JSON.stringify(e)));
          }
          if (item?.data?.errors?.length) {
            errorList.push(...item.data.errors.map(e => e.message || JSON.stringify(e)));
          }
        }
      } else {
        if (payload?.errors?.length) {
          errorList.push(...payload.errors.map(e => e.message || JSON.stringify(e)));
        }
        if (payload?.data?.errors?.length) {
          errorList.push(...payload.data.errors.map(e => e.message || JSON.stringify(e)));
        }
      }
      return errorList;
    };

    const errors = [];
    errors.push(...collectErrors(gqlData));
    errors.push(...collectErrors(totalsResponses));
    errors.push(...collectErrors(timeseriesResponses));
    errors.push(...collectErrors(countriesResult.rawResponses));
    errors.push(...collectErrors(urlsResult.rawResponses));

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
