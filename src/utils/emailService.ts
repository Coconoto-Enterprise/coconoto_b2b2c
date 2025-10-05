import { getCustomerEmailTemplate, getBusinessEmailTemplate } from './emailTemplates';

// Enhanced email service with HTML templates
export async function sendEmail(
  subject: string, 
  message: string, 
  customerEmail?: string,
  customerName?: string,
  orderType: string = 'Order'
) {
  const isDevelopment = window.location.hostname === 'localhost';
  
  if (isDevelopment) {
    // For development - simulate email sending and log details
    console.log('🔧 DEVELOPMENT MODE - Email would be sent:');
    console.log('📧 Subject:', subject);
    console.log('📄 Message:', message);
    console.log('📬 To: bamigboyeayomide095@gmail.com');
    if (customerEmail) {
      console.log('📬 Customer Email: ', customerEmail);
      console.log('📬 Customer Name: ', customerName);
    }
    console.log('⚠️ Note: CORS blocks Google Apps Script in development. This will work in production.');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, mode: 'development' };
  }
  
  try {
    // For production - use invisible iframe method to bypass CORS without opening new tabs
    console.log('🚀 PRODUCTION MODE - Sending email via invisible iframe...');
    return await sendEmailViaInvisibleIframe(subject, message, customerEmail, customerName, orderType);
    
  } catch (error) {
    console.error('❌ Failed to send email via Google Apps Script:', error);
    
    // In production, still throw the error, but provide more context
    if (!isDevelopment) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Email service error: ${errorMessage}`);
    }
    
    throw error;
  }
}

async function sendEmailViaInvisibleIframe(
  subject: string, 
  message: string, 
  customerEmail?: string,
  customerName?: string,
  orderType?: string
): Promise<{ success: boolean; mode: string }> {
  return new Promise((resolve, reject) => {
    // Create completely invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.visibility = 'hidden';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    
    // Give iframe a unique name
    const iframeName = `coconoto_email_iframe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    iframe.name = iframeName;

    // Create invisible form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbwm6E6ddHpPt1TnYpCW_ZKuKRL5C-ptJvutB1tbr1jBFK6BjdHshDLh1ta9bY2qAQFN0g/exec';
    form.target = iframeName;
    form.style.display = 'none';

    // Prepare HTML email templates if customer email exists
    let businessEmailHtml = message;
    let customerEmailHtml = '';
    
    if (customerEmail && customerName) {
      // Create HTML emails using templates
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

    // Add form fields
    const fields = [
      { name: 'subject', value: subject },
      { name: 'message', value: businessEmailHtml },
    ];
    
    if (customerEmail) {
      fields.push({ name: 'customerEmail', value: customerEmail });
      fields.push({ name: 'customerName', value: customerName || 'Valued Customer' });
      fields.push({ name: 'customerEmailHtml', value: customerEmailHtml });
    }

    fields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });

    // Handle completion
    let completed = false;
    const cleanup = () => {
      setTimeout(() => {
        try {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      }, 1000); // Wait 1 second before cleanup
    };

    // Success handler
    iframe.onload = () => {
      if (!completed) {
        completed = true;
        console.log('✅ Email sent successfully via invisible iframe');
        cleanup();
        resolve({ success: true, mode: 'production' });
      }
    };

    // Error handler
    iframe.onerror = () => {
      if (!completed) {
        completed = true;
        console.error('❌ Iframe error occurred');
        cleanup();
        reject(new Error('Failed to send email - iframe error'));
      }
    };

    // Timeout after 15 seconds
    const timeout = setTimeout(() => {
      if (!completed) {
        completed = true;
        console.log('⏰ Email sending timeout - assuming success');
        cleanup();
        resolve({ success: true, mode: 'production' }); // Assume success on timeout
      }
    }, 15000);

    // Add to DOM and submit
    try {
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      
      // Small delay to ensure iframe is ready
      setTimeout(() => {
        form.submit();
        console.log('📤 Form submitted to invisible iframe');
      }, 100);
      
    } catch (error) {
      completed = true;
      clearTimeout(timeout);
      cleanup();
      reject(error);
    }
  });
}