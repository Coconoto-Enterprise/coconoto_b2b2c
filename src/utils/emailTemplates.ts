// Email Templates for Coconoto
// Customer confirmation email template
export function getCustomerEmailTemplate(customerName: string, orderDetails: string, orderType: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Coconoto - Order Confirmation</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        .cta-button { 
            background-color: #8CC63F; 
            color: white; 
            padding: 12px 25px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            font-weight: bold;
            margin: 15px 0;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <center style="width: 100%; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

            <!-- Header -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #8CC63F;">
                <tr>
                    <td align="center" style="padding: 25px 0;">
                        <img src="data:image/png;base64,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" alt="Coconoto Logo" style="height: 40px; margin-bottom: 10px;" />
                        <h2 style="color: white; font-family: Arial, sans-serif; font-size: 18px; margin: 10px 0 0 0;">Thank you for choosing Coconoto!</h2>
                    </td>
                </tr>
            </table>

            <!-- Main Content -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 30px;">
                <tr>
                    <td align="left" style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #694C39;">

                        <h1 style="font-size: 24px; color: #618A42; margin: 0 0 20px 0;">Dear ${customerName},</h1>

                        <p style="margin-bottom: 20px;">We appreciate your interest in Coconoto and are excited to assist you with your coconut product needs.</p>

                        <!-- Order Details -->
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8CC63F;">
                            <h3 style="color: #618A42; margin-top: 0;">Your ${orderType} Details:</h3>
                            <div style="font-family: monospace; font-size: 14px; line-height: 1.6;">
                                ${orderDetails}
                            </div>
                        </div>

                        <p>
                            <strong>What happens next?</strong><br>
                            • Our team will review your request within 24 hours<br>
                            • You'll receive a detailed response with pricing and availability<br>
                            • We'll coordinate delivery based on your preferred timeline
                        </p>

                        <p>
                            <strong>Need immediate assistance?</strong><br>
                            📞 <strong>+234 814 860 9051</strong><br>
                            📧 <strong>bamigboyeayomide095@gmail.com</strong><br>
                            🌐 <strong>www.coconoto.com</strong>
                        </p>

                        <div style="background-color: #fff8e7; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #f0d000;">
                            <p style="margin: 0; font-size: 14px; color: #b8860b;">
                                <strong>💡 Did you know?</strong> Coconoto provides premium coconut products sourced directly from local farmers, ensuring quality and supporting sustainable agriculture.
                            </p>
                        </div>

                        <p style="margin-top: 30px;">
                            Warm regards,<br>
                            <strong>The Coconoto Customer Care Team</strong><br>
                            <em>Your trusted partner in coconut excellence</em>
                        </p>

                    </td>
                </tr>
            </table>

            <!-- Footer -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; padding: 20px 0; background-color: #f8f8f8;">
                <tr>
                    <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #694C39;">
                        <p style="margin: 5px 0;">© 2025 Coconoto Enterprise | All Rights Reserved</p>
                        <p style="margin: 5px 0; color: #888;">
                            This is an automated confirmation email.
                        </p>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
  `;
}

// Business notification email template
export function getBusinessEmailTemplate(
  notificationType: string, 
  customerInfo: any, 
  orderDetails: string, 
  timestamp: string,
  priority: string = 'HIGH'
): string {
  const priorityColor = priority === 'HIGH' ? '#ff4444' : priority === 'MEDIUM' ? '#ffaa00' : '#8CC63F';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Coconoto - Internal Notification</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        .data-table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background-color: #694C39; color: white; font-weight: bold; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f0f0;">
    <center style="width: 100%; background-color: #f0f0f0;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff;">

            <!-- Header -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #694C39;">
                <tr>
                    <td align="left" style="padding: 15px 25px;">
                        <img src="data:image/png;base64,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" alt="Coconoto Logo" style="height: 30px; margin-right: 15px; vertical-align: middle;" />
                        <span style="color: white; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;">COCONOTO - INTERNAL NOTIFICATION</span>
                    </td>
                    <td align="right" style="padding: 15px 25px;">
                        <div style="background-color: ${priorityColor}; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                            ${priority} PRIORITY
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Alert Banner -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #fff3cd; border-bottom: 3px solid #ffc107;">
                <tr>
                    <td style="padding: 15px 25px; font-family: Arial, sans-serif; font-size: 14px; color: #856404;">
                        <strong>🚨 New Activity Alert:</strong> ${notificationType} | Time: ${timestamp} | Action Required: YES
                    </td>
                </tr>
            </table>

            <!-- Main Content -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #ffffff; padding: 25px;">
                <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #333333;">

                        <h2 style="font-size: 20px; color: #694C39; margin: 0 0 20px 0; border-bottom: 2px solid #8CC63F; padding-bottom: 10px;">
                            ${notificationType}
                        </h2>

                        <!-- Key Information -->
                        <div style="background-color: #f8f9fa; border-left: 4px solid #694C39; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #694C39; margin-top: 0; font-size: 16px;">Customer Details:</h3>
                            <p style="margin: 5px 0;"><strong>Name:</strong> ${customerInfo.name || 'Not provided'}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${customerInfo.email}">${customerInfo.email}</a></p>
                            <p style="margin: 5px 0;"><strong>Phone:</strong> ${customerInfo.phone || 'Not provided'}</p>
                        </div>

                        <!-- Order Details -->
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8CC63F;">
                            <h3 style="color: #694C39; margin-top: 0;">Order/Request Details:</h3>
                            <div style="font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-line;">
${orderDetails}
                            </div>
                        </div>

                        <!-- Action Items -->
                        <div style="background-color: #e8f4fd; border: 1px solid #b8daff; border-radius: 5px; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #004085; margin-top: 0; font-size: 16px;">📋 Action Items Required:</h3>
                            <ul style="margin: 10px 0; color: #004085;">
                                <li>Review customer request details</li>
                                <li>Prepare quote/response within 24 hours</li>
                                <li>Follow up with customer via email or phone</li>
                            </ul>
                            <p style="margin-bottom: 0; font-weight: bold;">Deadline: Within 24 hours</p>
                        </div>

                        <!-- System Information -->
                        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 3px; margin: 20px 0; font-size: 12px; color: #666;">
                            <strong>System Info:</strong> 
                            Generated on ${timestamp} | 
                            Source: Website Form | 
                            Auto-notification from Coconoto System
                        </div>

                    </td>
                </tr>
            </table>

            <!-- Footer -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #333333; padding: 15px 0;">
                <tr>
                    <td align="center" style="font-family: Arial, sans-serif; font-size: 11px; color: #cccccc;">
                        <p style="margin: 5px 0;">
                            <strong>Coconoto Enterprise - Internal System</strong><br>
                            This is an automated notification. Reply to customer directly.
                        </p>
                        <p style="margin: 5px 0; font-size: 10px;">© 2025 Coconoto Internal Communications System</p>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
  `;
}