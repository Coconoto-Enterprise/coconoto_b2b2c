// Email Configuration Service
// Handles fetching and managing email sender configurations

import { supabase } from '../lib/supabase';

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

/**
 * Get sender configuration for a specific email type
 * @param emailType e.g., "waitlist_signup", "contact_inquiry", etc.
 * @returns Sender config with email and name, or null if not found
 */
export const getSenderForEmailType = async (
  emailType: string
): Promise<EmailSenderConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('email_sender_config')
      .select('*')
      .eq('email_type', emailType)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`❌ Error fetching sender config for ${emailType}:`, error);
      return null;
    }

    return data as EmailSenderConfig;
  } catch (err) {
    console.error('❌ Error in getSenderForEmailType:', err);
    return null;
  }
};

/**
 * Get all email sender configurations
 * @returns Array of all email sender configs
 */
export const getAllSenderConfigs = async (): Promise<EmailSenderConfig[]> => {
  try {
    const { data, error } = await supabase
      .from('email_sender_config')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching all sender configs:', error);
      return [];
    }

    return (data || []) as EmailSenderConfig[];
  } catch (err) {
    console.error('❌ Error in getAllSenderConfigs:', err);
    return [];
  }
};

/**
 * Update a sender configuration
 * @param emailType Email type to update
 * @param updates Fields to update (sender_email, sender_name, is_active)
 */
export const updateSenderConfig = async (
  emailType: string,
  updates: Partial<Omit<EmailSenderConfig, 'id' | 'created_at' | 'updated_at'>>
): Promise<EmailSenderConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('email_sender_config')
      .update(updates)
      .eq('email_type', emailType)
      .select()
      .single();

    if (error) {
      console.error(`❌ Error updating sender config for ${emailType}:`, error);
      return null;
    }

    return data as EmailSenderConfig;
  } catch (err) {
    console.error('❌ Error in updateSenderConfig:', err);
    return null;
  }
};

/**
 * Log a sent email to the email_logs table
 * @param emailData The email details to log
 */
export const logEmailSent = async (emailData: {
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
}): Promise<EmailLog | null> => {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .insert([emailData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error logging email:', error);
      return null;
    }

    return data as EmailLog;
  } catch (err) {
    console.error('❌ Error in logEmailSent:', err);
    return null;
  }
};

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

/**
 * Get all sent emails (for the sent folder view)
 * @param limit Number of emails to fetch
 * @param offset Pagination offset
 * @returns Array of email logs
 */
export const getSentEmails = async (
  limit: number = 50,
  offset: number = 0,
  sentByEmail?: string
): Promise<{ emails: EmailLog[]; total: number }> => {
  try {
    // Get total count
    let query = supabase.from('email_logs').select('*', { count: 'exact', head: true });
    if (sentByEmail) {
      query = query.ilike('from_address', `%${sentByEmail}%`);
    }
    const { count } = await query;

    // Fetch emails
    let fetchQuery = supabase.from('email_logs').select('*');
    if (sentByEmail) {
      fetchQuery = fetchQuery.ilike('from_address', `%${sentByEmail}%`);
    }

    const { data, error } = await fetchQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('❌ Error fetching sent emails:', error);
      return { emails: [], total: 0 };
    }

    return {
      emails: (data || []) as EmailLog[],
      total: count || 0
    };
  } catch (err) {
    console.error('❌ Error in getSentEmails:', err);
    return { emails: [], total: 0 };
  }
};

/**
 * Get sent emails filtered by type
 * @param emailType Email type to filter by
 * @param limit Number of emails to fetch
 * @returns Array of email logs
 */
export const getSentEmailsByType = async (
  emailType: string,
  limit: number = 50
): Promise<EmailLog[]> => {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('email_type', emailType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`❌ Error fetching sent emails for type ${emailType}:`, error);
      return [];
    }

    return (data || []) as EmailLog[];
  } catch (err) {
    console.error('❌ Error in getSentEmailsByType:', err);
    return [];
  }
};

/**
 * Update email status (e.g., when Resend webhook confirms delivery)
 * @param emailId Email log ID
 * @param status New status (delivered, failed, bounced, etc.)
 */
export const updateEmailStatus = async (
  emailId: string,
  status: string
): Promise<EmailLog | null> => {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .update({ status })
      .eq('id', emailId)
      .select()
      .single();

    if (error) {
      console.error(`❌ Error updating email status for ${emailId}:`, error);
      return null;
    }

    return data as EmailLog;
  } catch (err) {
    console.error('❌ Error in updateEmailStatus:', err);
    return null;
  }
};

/**
 * Search sent emails by subject, recipient, or sender
 * @param query Search query
 * @param limit Results limit
 */
export const searchSentEmails = async (
  query: string,
  limit: number = 50,
  sentByEmail?: string
): Promise<EmailLog[]> => {
  try {
    let searchQuery = supabase
      .from('email_logs')
      .select('*')
      .or(
        `subject.ilike.%${query}%,from_address.ilike.%${query}%,to_addresses.cs.${JSON.stringify([query])}`
      );

    if (sentByEmail) {
      searchQuery = searchQuery.eq('sent_by_email', sentByEmail);
    }

    const { data, error } = await searchQuery
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error searching sent emails:', error);
      return [];
    }

    return (data || []) as EmailLog[];
  } catch (err) {
    console.error('❌ Error in searchSentEmails:', err);
    return [];
  }
};

export const getSentEmailsBySender = async (
  senderEmail: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ emails: EmailLog[]; total: number }> => {
  try {
    const likeFilter = `%${senderEmail}%`;

    const { count } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .ilike('from_address', likeFilter);

    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .ilike('from_address', likeFilter)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('❌ Error fetching sent emails by sender:', error);
      return { emails: [], total: 0 };
    }

    return {
      emails: (data || []) as EmailLog[],
      total: count || 0
    };
  } catch (err) {
    console.error('❌ Error in getSentEmailsBySender:', err);
    return { emails: [], total: 0 };
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
