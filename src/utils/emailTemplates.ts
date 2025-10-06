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
                        <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="Coconoto Logo" style="height: 40px; margin-bottom: 10px;" />
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
                            <strong>Need immediate assistance?</strong><br>
                            📞 <strong>+234 814 860 9051</strong><br>
                            📧 <strong>bamigboyeayomide095@gmail.com</strong><br>
                            🌐 <strong>www.coconoto.com</strong>
                        </p>

                        <div style="background-color: #fff8e7; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #f0d000;">
                            <p style="margin: 0; font-size: 14px; color: #b8860b;">
                                <strong>💡 Did you know?</strong><br>
                                Coconoto provides premium coconut products sourced directly from local farmers, ensuring quality and supporting sustainable agriculture.
                            </p>
                        </div>

                        <!-- Featured Products Section -->
                        <div style="margin: 30px 0;">
                            <h3 style="color: #618A42; text-align: center; margin-bottom: 25px; font-size: 20px;">🥥 Featured Premium Products</h3>
                            
                            <!-- Product Cards Container -->
                            <table border="0" cellpadding="0" cellspacing="10" width="100%" style="margin: 20px 0;">
                                <tr>
                                    <!-- Product 1: Cocopeat -->
                                    <td width="33%" style="vertical-align: top;">
                                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            <img src="https://www.coconoto.africa/assets/cocpeat1-03oJOxP8.jpeg" alt="Cocopeat" width="120" height="120" style="border-radius: 8px; object-fit: cover; margin-bottom: 10px;">
                                            <h4 style="color: #694C39; margin: 10px 0 5px 0; font-size: 16px;">Cocopeat</h4>
                                            <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">Nutrient‑rich growing medium.</p>
                                            <div style="margin: 10px 0;">
                                                <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦5,000.</span>
                                                <span style="color: #999; font-size: 12px;">/5KG</span>
                                            </div>
                                            <a href="https://www.coconoto.africa/product" style="background-color: #8CC63F; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 5px;">Order Now</a>
                                        </div>
                                    </td>

                                    <!-- Product 2: Fresh Coconut Water -->
                                    <td width="33%" style="vertical-align: top;">
                                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            <img src="[COCONUT_WATER_IMAGE_URL]" alt="Fresh Coconut Water" width="120" height="120" style="border-radius: 8px; object-fit: cover; margin-bottom: 10px;">
                                            <h4 style="color: #694C39; margin: 10px 0 5px 0; font-size: 16px;">Fresh Coconut Water</h4>
                                            <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">100% natural coconut water. Refreshing and packed with electrolytes.</p>
                                            <div style="margin: 10px 0;">
                                                <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦15,500.</span>
                                                <span style="color: #999; font-size: 12px;">/1 Sack</span>
                                            </div>
                                            <a href="https://www.coconoto.africa/product" style="background-color: #8CC63F; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 5px;">Order Now</a>
                                        </div>
                                    </td>

                                    <!-- Product 3: Coconut Fiber -->
                                    <td width="33%" style="vertical-align: top;">
                                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            <img src="https://www.coconoto.africa/assets/fiber-Cx0Hxqe5.jpeg" alt="Coconut Fiber" width="120" height="120" style="border-radius: 8px; object-fit: cover; margin-bottom: 10px;">
                                            <h4 style="color: #694C39; margin: 10px 0 5px 0; font-size: 16px;">Coconut Fiber</h4>
                                            <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">Premium coconut fiber. Ideal for gardening and crafts.</p>
                                            <div style="margin: 10px 0;">
                                                <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦15,500</span>
                                                <span style="color: #999; font-size: 12px;">/1 Sack</span>
                                            </div>
                                            <a href="https://www.coconoto.africa/product" style="background-color: #8CC63F; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 5px;">Order Now</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- View All Products Link -->
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="https://www.coconoto.africa/product" style="color: #8CC63F; text-decoration: none; font-weight: bold; font-size: 14px; border-bottom: 2px solid #8CC63F;">View All Products →</a>
                            </div>
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
                        <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="Coconoto Logo" style="height: 30px; margin-right: 15px; vertical-align: middle;" />
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