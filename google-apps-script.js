// Google Apps Script code for handling emails
// Deploy this as a web app with execution as "Anyone" and access to "Anyone"

function doPost(e) {
  try {
    let subject, message;
    
    // Handle both JSON and form data
    if (e.postData && e.postData.type === 'application/json') {
      const data = JSON.parse(e.postData.contents);
      subject = data.subject;
      message = data.message;
    } else if (e.parameter) {
      subject = e.parameter.subject;
      message = e.parameter.message;
    } else {
      throw new Error('No data received');
    }
    
    if (!subject || !message) {
      throw new Error('Subject and message are required');
    }
    
    // Send email
    const recipient = 'bamigboyeayomide095@gmail.com';
    const emailSubject = `Coconoto Order: ${subject}`;
    const emailBody = `
New order received from Coconoto website:

${message}

---
Sent from Coconoto B2B2C Platform
Time: ${new Date().toLocaleString()}
    `;
    
    MailApp.sendEmail(recipient, emailSubject, emailBody);
    
    // Return success response
    return ContentService
      .createTextOutput('Email sent successfully')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('Error sending email:', error);
    return ContentService
      .createTextOutput('Error: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Coconoto Email Service is running')
    .setMimeType(ContentService.MimeType.TEXT);
}