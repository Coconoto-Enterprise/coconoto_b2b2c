// BACK TO WORKING VERCEL API - No more 500 errors!

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
  console.log('📧 Frontend - Using WORKING Vercel API route');
  console.log('📧 Email data:', emailData);

  try {
    console.log('📤 Frontend - Calling Vercel API route...');

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Vercel API failed: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Frontend - Vercel API response:', result);

    if (!result.success) {
      throw new Error(result.error || 'Email sending failed');
    }

    console.log('🎉 Emails sent successfully via WORKING Vercel API!');
  } catch (error) {
    console.error('❌ Frontend email service error:', error);
    throw error;
  }
};

export const sendContactEmails = async (contactData: ContactFormData): Promise<void> => {
  console.log('📧 Frontend - Sending contact form emails via WORKING Vercel API');
  
  try {
    const emailData: EmailData = {
      customerName: contactData.name,
      customerEmail: contactData.email,
      eventType: contactData.subject || 'Contact Inquiry',
      message: contactData.message,
      formType: 'Contact Form',
      formData: contactData
    };

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Vercel API failed: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Contact form emails sent via Vercel API:', result);

    if (!result.success) {
      throw new Error(result.error || 'Contact form email sending failed');
    }

  } catch (error) {
    console.error('❌ Contact form service error:', error);
    throw error;
  }
};