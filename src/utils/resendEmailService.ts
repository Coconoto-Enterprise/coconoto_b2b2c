import { Resend } from 'resend';
import { getCustomerEmailTemplate, getBusinessEmailTemplate } from './emailTemplates';

// Initialize Resend with API key
const resend = new Resend('re_dbkMUmvC_LoXFaA1PJJe6iWKaqT2PoeQU');

// Enhanced email service with Resend
export async function sendEmail(
  subject: string, 
  message: string, 
  customerEmail?: string,
  customerName?: string,
  orderType: string = 'Order'
) {
  console.log('📧 RESEND MODE - Sending emails...');
  console.log('📧 Subject:', subject);
  console.log('📬 Business Email: bamigboyeayomide095@gmail.com');
  
  if (customerEmail) {
    console.log('📬 Customer Email:', customerEmail);
    console.log('📬 Customer Name:', customerName);
  }

  try {
    const results = [];
    
    // Create HTML email templates if customer email exists
    let businessEmailHtml = message;
    let customerEmailHtml = '';
    
    if (customerEmail && customerName) {
      const customerInfo = { name: customerName, email: customerEmail };
      const timestamp = new Date().toLocaleString();
      
      businessEmailHtml = getBusinessEmailTemplate(
        subject,
        customerInfo,
        message,
        timestamp,
        'HIGH'
      );
      
      customerEmailHtml = getCustomerEmailTemplate(
        customerName,
        message,
        orderType || 'Request'
      );
    }

    // Send business notification email
    console.log('📤 Sending business notification...');
    const businessResult = await resend.emails.send({
      from: 'Coconoto <notifications@send.coconoto.africa>',
      to: ['bamigboyeayomide095@gmail.com'],
      subject: subject,
      html: businessEmailHtml,
    });
    
    console.log('✅ Business email sent:', businessResult);
    results.push({ type: 'business', result: businessResult });

    // Send customer confirmation email if provided
    if (customerEmail && customerEmailHtml && customerName) {
      console.log('📤 Sending customer confirmation...');
      const customerResult = await resend.emails.send({
        from: 'Coconoto <hello@send.coconoto.africa>',
        to: [customerEmail],
        subject: 'Thank you for your interest - Coconoto',
        html: customerEmailHtml,
      });
      
      console.log('✅ Customer email sent:', customerResult);
      results.push({ type: 'customer', result: customerResult });
    }

    console.log('🎉 All emails sent successfully via Resend!');
    return { success: true, mode: 'resend', results };
    
  } catch (error) {
    console.error('❌ Resend email sending failed:', error);
    
    if (error instanceof Error) {
      throw new Error(`Resend service error: ${error.message}`);
    }
    
    throw error;
  }
}

// Test function for Resend
export async function testResendService(): Promise<void> {
  console.log('🧪 Testing Resend email service...');
  
  try {
    const result = await resend.emails.send({
      from: 'Coconoto <test@send.coconoto.africa>',
      to: ['bamigboyeayomide095@gmail.com'],
      subject: 'Test Email from Coconoto - Resend',
      html: '<h1>Test Email</h1><p>This is a test email from your new Resend service!</p>',
    });
    
    console.log('✅ Resend test email sent successfully:', result);
    
  } catch (error) {
    console.error('❌ Resend test failed:', error);
  }
}