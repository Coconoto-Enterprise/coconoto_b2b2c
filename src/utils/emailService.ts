// Back to working Vercel API route - no more Edge Function issues!

export async function sendEmail(
  subject: string,
  message: string,
  customerEmail?: string,
  customerName?: string,
  orderType?: string
): Promise<void> {
  console.log('📧 Using WORKING Vercel API Route for email sending');
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: customerName || 'Unknown',
        customerEmail: customerEmail || '',
        eventType: orderType || subject,
        message: message,
        formType: 'Contact Form',
        formData: {
          subject,
          message,
          orderType
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Vercel API failed: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Email sent successfully via Vercel API:', result);
    
  } catch (error) {
    console.error('❌ Vercel API email failed:', error);
    throw error;
  }
}