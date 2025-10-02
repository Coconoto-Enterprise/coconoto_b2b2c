# Google Apps Script Update Instructions

Your current Google Apps Script needs to be updated to send emails to both you and your customers.

## Current Google Apps Script URL
https://script.google.com/macros/s/AKfycbwm6E6ddHpPt1TnYpCW_ZKuKRL5C-ptJvutB1tbr1jBFK6BjdHshDLh1ta9bY2qAQFN0g/exec

## Updated Google Apps Script Code

Replace your current Google Apps Script code with this updated version:

```javascript
function doPost(e) {
  try {
    const params = e.parameter;
    const subject = params.subject || 'No Subject';
    const message = params.message || 'No Message';
    const customerEmail = params.customerEmail; // New parameter for customer email
    
    // Your business email
    const businessEmail = 'bamigboyeayomide095@gmail.com';
    
    // Send notification to business owner
    MailApp.sendEmail({
      to: businessEmail,
      subject: subject,
      body: message
    });
    
    // If customer email is provided, send confirmation to customer
    if (customerEmail) {
      const customerSubject = 'Order Confirmation - Coconoto';
      const customerMessage = `Dear Customer,

Thank you for your interest in Coconoto! We have received your inquiry/order and will get back to you within 24 hours.

Your submission details:
${message}

Best regards,
The Coconoto Team

---
This is an automated confirmation email. Please do not reply to this email.
For questions, contact us at: bamigboyeayomide095@gmail.com`;

      MailApp.sendEmail({
        to: customerEmail,
        subject: customerSubject,
        body: customerMessage
      });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Emails sent successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Google Apps Script is working!'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## How to Update

1. Go to your Google Apps Script project: https://script.google.com/home/projects/1VQ8WroLRaObNIY2tsGLMvjHmO-_hkNKrDwgrrOiPRW8pW3QyhDDxnPBK
2. Replace the existing code with the updated code above
3. Save the project (Ctrl+S)
4. Deploy the updated version

## What This Update Does

- **Business Notifications**: Still sends all form submissions to bamigboyeayomide095@gmail.com
- **Customer Confirmations**: Now also sends confirmation emails to customers when they submit forms
- **Automatic Messages**: Customers receive a professional confirmation email letting them know you'll respond within 24 hours
- **Same URL**: Uses the same Google Apps Script URL, no changes needed in your website

## Test It

After updating the script, test it by:
1. Filling out a form on your website (waitlist, product order, etc.)
2. Check that you receive the notification email at bamigboyeayomide095@gmail.com
3. Check that the customer also receives a confirmation email

The customer confirmation email will look like:
```
Subject: Order Confirmation - Coconoto

Dear Customer,

Thank you for your interest in Coconoto! We have received your inquiry/order and will get back to you within 24 hours.

Your submission details:
[Their form details will be shown here]

Best regards,
The Coconoto Team

---
This is an automated confirmation email. Please do not reply to this email.
For questions, contact us at: bamigboyeayomide095@gmail.com
```