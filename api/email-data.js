// =============================================================================
// /api/email-data — service-role gateway for the Tweetit email dashboard.
//
// WHY THIS EXISTS
//   20260818000003_lock_pii_tables_and_policies_v3.sql (plus the
//   20260818000006 follow-up) revoked every privilege on `email_logs` and
//   `email_sender_config` from `anon` / `authenticated`. The dashboard was
//   reading both tables straight from the browser with the anon key, so every
//   request came back 401 / Postgres 42501
//   ("permission denied for table email_logs").
//
//   This endpoint keeps the service-role key on the server (it never reaches
//   the browser) and re-implements the intent of the policies that were
//   dropped, so the lockdown is not weakened:
//     * admin -> sees every row and may pick any sender
//     * staff -> sees only rows they sent (from_address / sent_by_email match)
//
// CALLER IDENTITY
//   The Tweetit portal uses its own cookie-less session (localStorage filled by
//   /api/auth), not Supabase Auth, so there is no JWT to inspect. Every request
//   must therefore carry `requesterId` + `requesterEmail`, which are verified
//   against `mail_users` before a single row is returned.
//
// RESOURCES
//   GET    ?resource=sender-configs                (admin)   list all configs
//   POST   ?resource=sender-configs                (admin)   update by email_type
//   GET    ?resource=sent-emails                   (scoped)  list/filter/paginate
//   POST   ?resource=sent-emails                   (self)    insert a log row
//   PATCH  ?resource=sent-emails                   (scoped)  update status by id
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import { applyCorsAllowlist } from './_shared-auth.js';

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 25;
const MAX_FILTER_LEN = 200;

const SENDER_CONFIG_UPDATABLE_FIELDS = ['sender_email', 'sender_name', 'is_active'];

let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    // Service-role only. Falling back to the anon key here would reproduce the
    // exact 42501 failures this endpoint exists to fix, so we refuse instead.
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Supabase service-role credentials not configured');
    }

    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
};

/**
 * Strip the characters that would break a PostgREST filter expression
 * (`,` and `()` split an `or=(...)` group, `\` escapes, `*`/`%` are wildcards,
 * `{}`/`"` delimit array literals).
 */
const sanitizeFilterValue = (value) => String(value ?? '')
  .replace(/[,()\\*%{}"']/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, MAX_FILTER_LEN);

const clampInt = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

const isAdmin = (requester) => String(requester?.role || '').toLowerCase() === 'admin';

const normalizeEmail = (value) => String(value ?? '').trim().toLowerCase();

/**
 * Every address a requester is allowed to claim as "their own".
 */
const identitiesOf = (requester) => Array.from(new Set(
  [requester?.sender_email, requester?.login_email]
    .map(normalizeEmail)
    .filter(Boolean)
));

/**
 * Resolve and verify the caller. Returns a mail_users-shaped record, or null.
 */
async function resolveRequester(req, params) {
  const requesterId = String(params.requesterId || '').trim();
  const requesterEmail = normalizeEmail(params.requesterEmail);

  // Super-admin fallback, mirroring api/auth.js handleAdminLogin: only honored
  // when the caller also proves possession of the shared admin secret. The id
  // alone is never enough (that was a P0 in the security audit).
  if (requesterId === 'super-admin') {
    const expected = process.env.DEFAULT_ADMIN_SECRET || process.env.API_MUTATIONS_KEY;
    const provided = req.headers?.['x-api-key'];
    if (
      !expected
      || typeof provided !== 'string'
      || provided.length !== expected.length
    ) {
      return null;
    }
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    if (mismatch !== 0) return null;

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'team@coconoto.africa';
    return {
      id: 'super-admin',
      login_email: adminEmail,
      sender_email: adminEmail,
      role: 'admin',
      is_active: true,
    };
  }

  if (!requesterId || !requesterEmail) return null;

  const { data, error } = await getSupabaseClient()
    .from('mail_users')
    .select('id, login_email, sender_email, role, is_active')
    .eq('id', requesterId)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;

  const known = [data.login_email, data.sender_email].map(normalizeEmail).filter(Boolean);
  if (!known.includes(requesterEmail)) return null;

  return data;
}

// ---------------------------------------------------------------------------
// email_sender_config
// ---------------------------------------------------------------------------

async function listSenderConfigs(res) {
  const { data, error } = await getSupabaseClient()
    .from('email_sender_config')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[email-data] sender-configs list failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to load sender configuration' });
  }

  return res.status(200).json({ success: true, configs: data || [] });
}

async function updateSenderConfig(body, res) {
  const emailType = String(body.email_type || '').trim();
  if (!emailType) {
    return res.status(400).json({ success: false, error: 'email_type is required' });
  }

  const patch = {};
  for (const field of SENDER_CONFIG_UPDATABLE_FIELDS) {
    if (body[field] !== undefined) patch[field] = body[field];
  }
  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ success: false, error: 'No updatable fields supplied' });
  }

  if (patch.sender_email !== undefined) {
    const senderEmail = normalizeEmail(patch.sender_email);
    if (!senderEmail || !senderEmail.endsWith('@coconoto.africa')) {
      return res.status(400).json({
        success: false,
        error: 'sender_email must be a @coconoto.africa address',
      });
    }
    patch.sender_email = senderEmail;
  }
  if (patch.sender_name !== undefined) {
    patch.sender_name = String(patch.sender_name).trim().slice(0, 120);
    if (!patch.sender_name) {
      return res.status(400).json({ success: false, error: 'sender_name cannot be empty' });
    }
  }
  if (patch.is_active !== undefined) {
    patch.is_active = Boolean(patch.is_active);
  }

  const { data, error } = await getSupabaseClient()
    .from('email_sender_config')
    .update(patch)
    .eq('email_type', emailType)
    .select()
    .maybeSingle();

  if (error) {
    console.error('[email-data] sender-config update failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update sender configuration' });
  }
  if (!data) {
    return res.status(404).json({ success: false, error: `No sender config for "${emailType}"` });
  }

  return res.status(200).json({ success: true, config: data });
}

// ---------------------------------------------------------------------------
// email_logs
// ---------------------------------------------------------------------------

/**
 * Build a PostgREST query already restricted to what the caller may read.
 * Returns null when the caller has no identity to scope on (deny).
 */
function scopedEmailQuery(requester, { sender, emailType, count } = {}) {
  let query = getSupabaseClient()
    .from('email_logs')
    .select('*', count ? { count: 'exact', head: true } : {});

  if (emailType) {
    query = query.eq('email_type', emailType);
  }

  if (isAdmin(requester)) {
    // Admins may browse the whole log, optionally narrowed to one sender.
    if (sender) {
      query = query.or(`from_address.ilike.%${sender}%,sent_by_email.ilike.%${sender}%`);
    }
    return query;
  }

  // Staff: only their own sends, no matter what they asked for.
  const identities = identitiesOf(requester);
  if (identities.length === 0) return null;

  const clauses = identities.flatMap((identity) => ([
    `from_address.ilike.%${identity}%`,
    `sent_by_email.ilike.%${identity}%`,
  ]));

  return query.or(clauses.join(','));
}

async function listSentEmails(requester, params, res) {
  const limit = clampInt(params.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const offset = clampInt(params.offset, 0, 0, 1_000_000);
  const sender = sanitizeFilterValue(params.sender);
  const emailType = sanitizeFilterValue(params.emailType);
  const search = sanitizeFilterValue(params.search);

  // --- Search path -------------------------------------------------------
  // Search spans subject / from_address / sent_by_email plus exact recipient
  // matches. The recipient match runs as a separate `.contains()` query so a
  // malformed array literal can never take the whole search down with it.
  // Row-level scoping is applied in JS here (the result set is capped at
  // MAX_LIMIT) so we never have to stack two PostgREST `or=` groups.
  if (search) {
    const pattern = `%${search}%`;

    let primaryQuery = getSupabaseClient()
      .from('email_logs')
      .select('*')
      .or([
        `subject.ilike.${pattern}`,
        `from_address.ilike.${pattern}`,
        `sent_by_email.ilike.${pattern}`,
      ].join(','))
      .order('created_at', { ascending: false })
      .limit(MAX_LIMIT);
    if (emailType) primaryQuery = primaryQuery.eq('email_type', emailType);

    const primary = await primaryQuery;

    if (primary.error) {
      console.error('[email-data] email search failed:', primary.error.message);
      return res.status(500).json({ success: false, error: 'Search failed' });
    }

    const merged = new Map((primary.data || []).map((row) => [row.id, row]));

    if (search.includes('@')) {
      let recipientQuery = getSupabaseClient()
        .from('email_logs')
        .select('*')
        .contains('to_addresses', [search])
        .order('created_at', { ascending: false })
        .limit(MAX_LIMIT);
      if (emailType) recipientQuery = recipientQuery.eq('email_type', emailType);

      const recipient = await recipientQuery;

      if (recipient.error) {
        console.warn('[email-data] recipient search skipped:', recipient.error.message);
      } else {
        for (const row of recipient.data || []) merged.set(row.id, row);
      }
    }

    const allowedIdentities = isAdmin(requester) ? null : identitiesOf(requester);
    if (!isAdmin(requester) && allowedIdentities.length === 0) {
      return res.status(403).json({ success: false, error: 'No mailbox is associated with this account' });
    }

    const matchesScope = (row) => {
      const from = normalizeEmail(row.from_address);
      const by = normalizeEmail(row.sent_by_email);
      if (allowedIdentities) {
        return allowedIdentities.some((identity) => from.includes(identity) || by.includes(identity));
      }
      if (sender) return from.includes(sender) || by.includes(sender);
      return true;
    };

    const rows = Array.from(merged.values())
      .filter(matchesScope)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return res.status(200).json({ success: true, emails: rows, total: rows.length });
  }

  // --- Browse path -------------------------------------------------------
  const countQuery = scopedEmailQuery(requester, { sender, emailType, count: true });
  const dataQuery = scopedEmailQuery(requester, { sender, emailType });
  if (!countQuery || !dataQuery) {
    return res.status(403).json({ success: false, error: 'No mailbox is associated with this account' });
  }

  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error('[email-data] email count failed:', countError.message);
    return res.status(500).json({ success: false, error: 'Failed to load emails' });
  }

  const { data, error } = await dataQuery
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[email-data] email list failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to load emails' });
  }

  return res.status(200).json({ success: true, emails: data || [], total: count || 0 });
}

async function insertEmailLog(requester, body, res) {
  const identities = identitiesOf(requester);
  const sentByEmail = normalizeEmail(body.sent_by_email);

  // A caller may only attribute a row to themselves (or leave it unattributed).
  if (sentByEmail && !identities.includes(sentByEmail)) {
    return res.status(403).json({
      success: false,
      error: 'sent_by_email must match the authenticated account',
    });
  }

  const row = {
    from_address: String(body.from_address || '').trim(),
    to_addresses: Array.isArray(body.to_addresses) ? body.to_addresses.map(String) : [],
    subject: String(body.subject || '').slice(0, 998),
    preview: body.preview ? String(body.preview).slice(0, 2000) : null,
    full_html: body.full_html ? String(body.full_html) : null,
    email_type: body.email_type ? String(body.email_type).slice(0, 64) : null,
    status: String(body.status || 'pending').slice(0, 32),
    resend_id: body.resend_id ? String(body.resend_id) : null,
    resend_created_at: body.resend_created_at || null,
    sent_by_email: sentByEmail || identities[0] || null,
  };

  if (!row.from_address || !row.subject || row.to_addresses.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'from_address, to_addresses and subject are required',
    });
  }

  const { data, error } = await getSupabaseClient()
    .from('email_logs')
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error('[email-data] email log insert failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to log email' });
  }

  return res.status(201).json({ success: true, email: data });
}

async function updateEmailLog(requester, body, res) {
  const id = String(body.id || '').trim();
  const status = String(body.status || '').trim();
  if (!id || !status) {
    return res.status(400).json({ success: false, error: 'id and status are required' });
  }

  let query = getSupabaseClient()
    .from('email_logs')
    .update({ status: status.slice(0, 32) })
    .eq('id', id);

  if (!isAdmin(requester)) {
    const identities = identitiesOf(requester);
    if (identities.length === 0) {
      return res.status(403).json({ success: false, error: 'Not permitted' });
    }
    query = query.or(identities.flatMap((identity) => ([
      `from_address.ilike.%${identity}%`,
      `sent_by_email.ilike.%${identity}%`,
    ])).join(','));
  }

  const { data, error } = await query.select().maybeSingle();

  if (error) {
    console.error('[email-data] email status update failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update email' });
  }
  if (!data) {
    return res.status(404).json({ success: false, error: 'Email not found' });
  }

  return res.status(200).json({ success: true, email: data });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  applyCorsAllowlist(req, res, { methods: 'GET, POST, PATCH, OPTIONS' });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!['GET', 'POST', 'PATCH'].includes(req.method)) {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = (req.body && typeof req.body === 'object') ? req.body : {};
    const params = { ...(req.query || {}), ...body };
    const resource = String(params.resource || '').trim();

    if (!['sender-configs', 'sent-emails'].includes(resource)) {
      return res.status(400).json({ success: false, error: 'Unknown resource' });
    }

    const requester = await resolveRequester(req, params);
    if (!requester) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (resource === 'sender-configs') {
      if (!isAdmin(requester)) {
        return res.status(403).json({ success: false, error: 'Admin privileges required' });
      }
      if (req.method === 'GET') return await listSenderConfigs(res);
      if (req.method === 'POST') return await updateSenderConfig(body, res);
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    if (req.method === 'GET') return await listSentEmails(requester, params, res);
    if (req.method === 'POST') return await insertEmailLog(requester, body, res);
    return await updateEmailLog(requester, body, res);
  } catch (error) {
    const misconfigured = String(error?.message || '').includes('service-role credentials');
    console.error('[email-data] handler error:', error?.message);
    return res.status(misconfigured ? 503 : 500).json({
      success: false,
      error: misconfigured
        ? 'Email storage is not configured: set SUPABASE_SERVICE_ROLE_KEY'
        : 'Failed to process request',
    });
  }
}
