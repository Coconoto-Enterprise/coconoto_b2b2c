// Updated Resend service to use Vercel API route (solves CORS issue)

interface EmailData {
  customerName?: string;
  customerEmail?: string;
  eventType?: string;
  message?: string;
  formType: string;
  formData?: any;
}

export const sendWaitlistEmails = async (emailData: EmailData): Promise<void> => {
  console.log('📧 Frontend - Preparing to send emails via API route');
  console.log('📧 Email data:', emailData);

  const { customerName, customerEmail, eventType, message, formType, formData } = emailData;

  try {
    const subject = `New ${formType} Submission - Coconoto`;

    console.log('📤 Frontend - Calling API route...');

    // Call our Vercel API route with simplified data structure
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        customerEmail,
        customerName,
        formType,
        formData,
        eventType,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API route failed: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Frontend - API route response:', result);

    if (!result.success) {
      throw new Error(result.error || 'Email sending failed');
    }

    console.log('🎉 Frontend - All emails sent successfully via API route!');

  } catch (error) {
    console.error('❌ Frontend - Email sending failed:', error);
    throw error;
  }
};

export const sendContactEmails = async (emailData: EmailData): Promise<void> => {
  return sendWaitlistEmails({ ...emailData, formType: 'Contact Form' });
};

export const sendEventBookingEmails = async (emailData: EmailData): Promise<void> => {
  return sendWaitlistEmails({ ...emailData, formType: 'Event Booking' });
};