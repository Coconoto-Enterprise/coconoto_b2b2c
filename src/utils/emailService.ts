import { sendContactEmails } from './supabaseEmailService';

export async function sendEmail(
  subject: string,
  message: string,
  customerEmail?: string,
  customerName?: string,
  orderType?: string
): Promise<void> {
  console.log('📧 Legacy sendEmail redirecting to Supabase Edge Function');
  return sendContactEmails({
    name: customerName || 'Unknown',
    email: customerEmail || '',
    message: message || '',
    subject: subject || orderType || 'General Inquiry'
  });
}