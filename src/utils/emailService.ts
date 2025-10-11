import { sendContactEmails } from './apiEmailService';

export async function sendEmail(
  subject: string,
  message: string,
  customerEmail?: string,
  customerName?: string,
  orderType?: string
): Promise<void> {
  return sendContactEmails({
    customerName: customerName || 'Unknown',
    customerEmail: customerEmail || '',
    eventType: orderType || 'General Inquiry',
    message: message || '',
    formType: 'Legacy Form',
    formData: { subject, message, customerEmail, customerName, orderType }
  });
}