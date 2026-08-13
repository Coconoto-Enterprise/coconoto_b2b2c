// Thin wrapper used by the marketplace / lead forms to send notification
// emails. Delegates to the Supabase Edge Function sender so the whole app
// uses a single email transport. Replaces the previously-missing
// `../../../utils/emailService` module that several modals imported.
import { sendContactEmails } from './supabaseEmailService';

export const sendEmail = async (
  subject: string,
  body: string,
  to?: string
): Promise<void> => {
  await sendContactEmails({
    name: to || 'Coconoto',
    email: to || '',
    message: body,
    subject,
  });
};
