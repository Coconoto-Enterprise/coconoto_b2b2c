export async function sendEmail(subject: string, message: string, customerEmail?: string) {
  const isDevelopment = window.location.hostname === 'localhost';
  
  if (isDevelopment) {
    // For development - simulate email sending and log details
    console.log('🔧 DEVELOPMENT MODE - Email would be sent:');
    console.log('📧 Subject:', subject);
    console.log('📄 Message:', message);
    console.log('📬 To: bamigboyeayomide095@gmail.com');
    if (customerEmail) {
      console.log('📬 Customer Email: ', customerEmail);
    }
    console.log('⚠️ Note: CORS blocks Google Apps Script in development. This will work in production.');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, mode: 'development' };
  }
  
  try {
    // For production - use Google Apps Script with form submission to bypass CORS
    console.log('🚀 PRODUCTION MODE - Sending email via Google Apps Script...');
    
    // Create a hidden form to submit data and bypass CORS
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbwm6E6ddHpPt1TnYpCW_ZKuKRL5C-ptJvutB1tbr1jBFK6BjdHshDLh1ta9bY2qAQFN0g/exec';
    form.target = '_blank'; // Open in new tab to avoid navigation
    form.style.display = 'none';
    
    // Add subject field
    const subjectInput = document.createElement('input');
    subjectInput.name = 'subject';
    subjectInput.value = subject;
    form.appendChild(subjectInput);
    
    // Add message field
    const messageInput = document.createElement('input');
    messageInput.name = 'message';
    messageInput.value = message;
    form.appendChild(messageInput);
    
    // Add customer email if provided
    if (customerEmail) {
      const customerEmailInput = document.createElement('input');
      customerEmailInput.name = 'customerEmail';
      customerEmailInput.value = customerEmail;
      form.appendChild(customerEmailInput);
    }
    
    // Submit form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    console.log('✅ Email submission sent via form (bypasses CORS)');
    return { success: true, data: 'Form submitted', mode: 'production' };
    
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