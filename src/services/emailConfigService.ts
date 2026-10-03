// Email Configuration Service
// Handles fetching and managing email sender configurations.
//
// IMPORTANT — why this file talks to /api/email-data instead of Supabase directly
// -----------------------------------------------------------------------------
// `20260818000003_lock_pii_tables_and_policies_v3.sql` (and the
// `20260818000006` follow-up) revoked every privilege on `email_logs` and
// `email_sender_config` from `anon` / `authenticated`. The browser only ever
// holds the anon key, so the previous `supabase.from('email_logs')...` calls all
// failed with 401 + Postgres 42501 "permission denied for table email_logs".
//
// Every read/write of those two tables now goes through `/api/email-data`,
// which holds the service-role key server-side and re-implements the row-level
// rules: admins see everything, staff only see their own sends.

import { supabase } from '../lib/supabase';

const EMAIL_DATA_API = '/api/email-data';

export interface EmailSenderConfig {
  id: string;
  email_type: string;
  sender_email: string;
  sender_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  from_address: string;
  to_addresses: string[];
  subject: string;
  preview?: string;
  full_html?: string;
  email_type?: string;
  status: string;
  resend_id?: string;
  resend_created_at?: string;
  sent_by_id?: string;
  sent_by_email?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailUser {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MailUser {
  id: string;
  login_email: string;
  sender_email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/** The signed-in mail user, used to authenticate /api/email-data requests. */
export interface EmailRequester {
  id?: string;
  email?: string;
}

// ---------------------------------------------------------------------------
// Requester helpers
// ---------------------------------------------------------------------------

/**
 * The portal keeps its session in localStorage (set by TweetitLogin /
 * VintageLogin). `/api/email-data` verifies these two values against
 * `mail_users` before returning any row.
 */
const readStoredMailUser = (): Record<string, any> | null => {
  if (typeof window === 'undefined') return null;

  for (const key of ['tweetitUser', 'currentMailUser']) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      // Ignore malformed entries and fall through to the next key.
    }
  }
  return null;
};

const resolveRequester = (override?: EmailRequester): Required<EmailRequester> => {
  const stored = readStoredMailUser();
  const id = override?.id || stored?.id || '';
  const email = override?.email
    || stored?.sender_email
    || stored?.login_email
    || stored?.email
    || '';
  return { id: String(id || ''), email: String(email || '') };
};

const buildUrl = (params: Record<string, string | number | undefined | null>): string => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    query.set(key, String(value));
  }
  return `${EMAIL_DATA_API}?${query.toString()}`;
};

const requestEmailData = async <T>(
  params: Record<string, string | number | undefined | null>,
  init?: RequestInit
): Promise<T | null> => {
  try {
    const response = await fetch(buildUrl(params), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success) {
      console.error(
        `❌ email-data ${params.resource} failed (${response.status}):`,
        payload?.error || response.statusText
      );
      return null;
    }

    return payload as T;
  } catch (err) {
    console.error('❌ email-data request error:', err);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Sender configuration
// ---------------------------------------------------------------------------

/**
 * Get sender configuration for a specific email type.
 *
 * Uses the SECURITY DEFINER RPC `get_sender_config_for_type`, which is the
 * one anon-granted door into `email_sender_config` left open by the lockdown
 * migration (it returns a single active row and cannot leak the table).
 */
export const getSenderForEmailType = async (
  emailType: string
): Promise<EmailSenderConfig | null> => {
  try {
    const { data, error } = await supabase.rpc('get_sender_config_for_type', {
      p_email_type: emailType,
    });

    if (error) {
      console.error(`❌ Error fetching sender config for ${emailType}:`, error);
      return null;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return null;

    const now = new Date().toISOString();
    return {
      id: `rpc-${emailType}`,
      email_type: emailType,
      sender_email: row.sender_email,
      sender_name: row.sender_name,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
  } catch (err) {
    console.error('❌ Error in getSenderForEmailType:', err);
    return null;
  }
};

/**
 * Get all email sender configurations (admin only).
 */
export const getAllSenderConfigs = async (
  requester?: EmailRequester
): Promise<EmailSenderConfig[]> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ configs: EmailSenderConfig[] }>({
    resource: 'sender-configs',
    requesterId: id,
    requesterEmail: email,
  });

  return payload?.configs || [];
};

/**
 * Update a sender configuration (admin only).
 */
export const updateSenderConfig = async (
  emailType: string,
  updates: Partial<Omit<EmailSenderConfig, 'id' | 'created_at' | 'updated_at'>>,
  requester?: EmailRequester
): Promise<EmailSenderConfig | null> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ config: EmailSenderConfig }>(
    { resource: 'sender-configs', requesterId: id, requesterEmail: email },
    { method: 'POST', body: JSON.stringify({ email_type: emailType, ...updates }) }
  );

  return payload?.config || null;
};

// ---------------------------------------------------------------------------
// Sent emails (email_logs)
// ---------------------------------------------------------------------------

/**
 * Log a sent email to the email_logs table.
 *
 * Server-side senders (api/send-email.js, api/send-custom-email.js) write their
 * own rows with the service-role key; this client-side variant exists for
 * callers that only have a mail-user session.
 */
export const logEmailSent = async (
  emailData: {
    from_address: string;
    to_addresses: string[];
    subject: string;
    preview?: string;
    full_html?: string;
    email_type?: string;
    status: string;
    resend_id?: string;
    resend_created_at?: string;
    sent_by_id?: string;
    sent_by_email?: string;
  },
  requester?: EmailRequester
): Promise<EmailLog | null> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ email: EmailLog }>(
    { resource: 'sent-emails', requesterId: id, requesterEmail: email },
    { method: 'POST', body: JSON.stringify(emailData) }
  );

  return payload?.email || null;
};

/**
 * Get all sent emails (for the sent folder view).
 * Admins see every row; staff are scoped to their own sends server-side.
 */
export const getSentEmails = async (
  limit: number = 50,
  offset: number = 0,
  sentByEmail?: string,
  requester?: EmailRequester
): Promise<{ emails: EmailLog[]; total: number }> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ emails: EmailLog[]; total: number }>({
    resource: 'sent-emails',
    requesterId: id,
    requesterEmail: email,
    limit,
    offset,
    sender: sentByEmail,
  });

  return { emails: payload?.emails || [], total: payload?.total || 0 };
};

/**
 * Get sent emails filtered by email type.
 */
export const getSentEmailsByType = async (
  emailType: string,
  limit: number = 50,
  requester?: EmailRequester
): Promise<EmailLog[]> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ emails: EmailLog[] }>({
    resource: 'sent-emails',
    requesterId: id,
    requesterEmail: email,
    emailType,
    limit,
  });

  return payload?.emails || [];
};

/**
 * Get sent emails filtered by sender address (the mailbox sidebar).
 */
export const getSentEmailsBySender = async (
  senderEmail: string,
  limit: number = 50,
  offset: number = 0,
  requester?: EmailRequester
): Promise<{ emails: EmailLog[]; total: number }> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ emails: EmailLog[]; total: number }>({
    resource: 'sent-emails',
    requesterId: id,
    requesterEmail: email,
    sender: senderEmail,
    limit,
    offset,
  });

  return { emails: payload?.emails || [], total: payload?.total || 0 };
};

/**
 * Search sent emails by subject, recipient, or sender.
 */
export const searchSentEmails = async (
  query: string,
  limit: number = 50,
  sentByEmail?: string,
  requester?: EmailRequester
): Promise<EmailLog[]> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ emails: EmailLog[] }>({
    resource: 'sent-emails',
    requesterId: id,
    requesterEmail: email,
    search: query,
    sender: sentByEmail,
    limit,
  });

  return payload?.emails || [];
};

/**
 * Update email status (e.g. when the Resend webhook confirms delivery).
 */
export const updateEmailStatus = async (
  emailId: string,
  status: string,
  requester?: EmailRequester
): Promise<EmailLog | null> => {
  const { id, email } = resolveRequester(requester);

  const payload = await requestEmailData<{ email: EmailLog }>(
    { resource: 'sent-emails', requesterId: id, requesterEmail: email },
    { method: 'PATCH', body: JSON.stringify({ id: emailId, status }) }
  );

  return payload?.email || null;
};

// ---------------------------------------------------------------------------
// Users (served by /api/auth, which already runs with the service-role key)
// ---------------------------------------------------------------------------

export const getEmailUsers = async (
  requesterId: string,
  requesterEmail: string
): Promise<EmailUser[]> => {
  try {
    if (!requesterId || !requesterEmail) {
      return [];
    }

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'email-user-list',
        requesterId,
        requesterEmail
      })
    });
    const data = await response.json();

    if (!data.success) {
      console.error('❌ Error fetching email users:', data.error);
      return [];
    }

    return data.users as EmailUser[];
  } catch (err) {
    console.error('❌ Error fetching email users:', err);
    return [];
  }
};

export const createEmailUser = async (
  requesterId: string,
  requesterEmail: string,
  email: string,
  password: string,
  role: 'admin' | 'staff' = 'staff'
): Promise<EmailUser> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'email-user-create',
        requesterId,
        requesterEmail,
        email,
        password,
        role
      })
    });
    const data = await response.json();

    if (!data.success) {
      const errorMessage = data.error || 'Failed to create email user';
      console.error('❌ Error creating email user:', errorMessage);
      throw new Error(errorMessage);
    }

    return data.user as EmailUser;
  } catch (err: any) {
    console.error('❌ Error creating email user:', err?.message || err);
    throw new Error(err?.message || 'Failed to create email user');
  }
};

export const updateEmailUserPassword = async (
  requesterId: string,
  requesterEmail: string,
  userId: string,
  password: string
): Promise<EmailUser | null> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'email-user-update-password',
        requesterId,
        requesterEmail,
        userId,
        password
      })
    });
    const data = await response.json();

    if (!data.success) {
      console.error('❌ Error updating email user password:', data.error);
      return null;
    }

    return data.user as EmailUser;
  } catch (err) {
    console.error('❌ Error updating email user password:', err);
    return null;
  }
};

export const getMailUsers = async (): Promise<MailUser[]> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list-mail-users' }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error('❌ Error fetching mail users:', data.error);
      return [];
    }

    return data.mailUsers || [];
  } catch (err) {
    console.error('❌ Error in getMailUsers:', err);
    return [];
  }
};

export const createMailUser = async (
  login_email: string,
  password: string,
  sender_email: string,
  role: string = 'user'
): Promise<MailUser | null> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create-mail-user',
        login_email,
        password,
        sender_email,
        role
      }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error('❌ Error creating mail user:', data.error);
      return null;
    }

    return data.mailUser || null;
  } catch (err) {
    console.error('❌ Error in createMailUser:', err);
    return null;
  }
};

export const deleteEmail = async (
  emailId: string,
  requesterId: string,
  requesterEmail: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete-email',
        emailId,
        requesterId,
        requesterEmail,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error('❌ Error deleting email:', data.error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('❌ Error in deleteEmail:', err);
    return false;
  }
};
