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