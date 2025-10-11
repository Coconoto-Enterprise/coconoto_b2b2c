// Supabase Edge Function email service

import { supabase } from '../lib/supabase';

interface EmailData {
  customerName?: string;
  customerEmail?: string;
  eventType?: string;
  message?: string;
  formType: string;
  formData?: any;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export const sendWaitlistEmails = async (emailData: EmailData): Promise<void> => {
  console.log('📧 Frontend - Preparing to send emails via Supabase Edge Function');
  console.log('📧 Email data:', emailData);

  const { customerName, customerEmail, eventType, message, formType, formData } = emailData;

  try {
    const subject = `New ${formType} Submission - Coconoto`;

    console.log('📤 Frontend - Calling Supabase Edge Function...');

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        name: customerName,
        email: customerEmail,
        message: message || `New ${formType} submission`,
        subject: subject,
        formType: formType,
        formData: formData,
        eventType: eventType
      },
    });

    if (error) {
      console.error('❌ Edge Function error:', error);
      throw new Error(`Edge Function failed: ${error.message}`);
    }

    console.log('✅ Frontend - Edge Function response:', data);

    if (!data?.success) {
      throw new Error(data?.error || 'Email sending failed');
    }

    console.log('🎉 Emails sent successfully via Supabase Edge Function!');
  } catch (error) {
    console.error('❌ Frontend email service error:', error);
    throw error;
  }
};

export const sendContactEmails = async (contactData: ContactFormData): Promise<void> => {
  console.log('📧 Frontend - Sending contact form emails via Supabase Edge Function');
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
        subject: contactData.subject || 'General Inquiry'
      },
    });

    if (error) {
      console.error('❌ Contact form Edge Function error:', error);
      throw new Error(`Edge Function failed: ${error.message}`);
    }

    console.log('✅ Contact form emails sent:', data);

    if (!data?.success) {
      throw new Error(data?.error || 'Contact form email sending failed');
    }

  } catch (error) {
    console.error('❌ Contact form service error:', error);
    throw error;
  }
};