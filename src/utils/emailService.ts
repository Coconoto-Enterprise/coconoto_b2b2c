export async function sendEmail(subject: string, message: string) {
  const isDevelopment = window.location.hostname === 'localhost';
  
  if (isDevelopment) {
    // For development - simulate email sending and log details
    console.log('🔧 DEVELOPMENT MODE - Email would be sent:');
    console.log('📧 Subject:', subject);
    console.log('📄 Message:', message);
    console.log('📬 To: bamigboyeayomide095@gmail.com');
    console.log('⚠️ Note: CORS blocks Google Apps Script in development. This will work in production.');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, mode: 'development' };
  }
  
  try {
    // For production - use Google Apps Script
    console.log('🚀 PRODUCTION MODE - Sending email via Google Apps Script...');
    
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbwm6E6ddHpPt1TnYpCW_ZKuKRL5C-ptJvutB1tbr1jBFK6BjdHshDLh1ta9bY2qAQFN0g/exec',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      }
    );
    
    if (!response || !response.ok) {
      throw new Error(`HTTP error! status: ${response?.status || 'Unknown'}`);
    }
    
    const result = await response.text();
    console.log('✅ Email sent successfully via Google Apps Script:', result);
    return { success: true, data: result, mode: 'production' };
    
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