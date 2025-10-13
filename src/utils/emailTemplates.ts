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

                        <p style="margin-bottom: 20px;">We appreciate your interest in Coco-Connect! Watch out for updates on our product offerings and launch.</p>

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
                            📧 <strong>info@coconoto.africa</strong><br>
                            🌐 <strong>www.coconoto.africa</strong>
                        </p>



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
                                            <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">Natural and organic. Perfect for healthy plant growth.</p>
                                            <div style="margin: 10px 0;">
                                                <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦5,000.</span>
                                                <span style="color: #999; font-size: 12px;">/5KG</span>
                                            </div>
                                            <a href="https://www.coconoto.africa/product" style="background-color: #8CC63F; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 5px;">Order Now</a>
                                        </div>
                                    </td>

                                    <!-- Product 2: Cocopot -->
                                    <td width="33%" style="vertical-align: top;">
                                        <div style="background-color: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            <img src="https://www.coconoto.africa/assets/cocopot2-DJXRmWOe.jpg" alt="Cocopot" width="120" height="120" style="border-radius: 8px; object-fit: cover; margin-bottom: 10px;">
                                            <h4 style="color: #694C39; margin: 10px 0 5px 0; font-size: 16px;">Cocopot</h4>
                                            <p style="font-size: 12px; color: #666; margin: 5px 0; line-height: 16px;">100% natural coconut water. Refreshing and packed with electrolytes.</p>
                                            <div style="margin: 10px 0;">
                                                <span style="color: #8CC63F; font-size: 18px; font-weight: bold;">₦5,500.</span>
                                                <span style="color: #999; font-size: 12px;">/1 POT</span>
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

                                                <div style="background-color: #fff8e7; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #f0d000;">
                            <p style="margin: 0; font-size: 14px; color: #b8860b;">
                                <strong>💡 Did you know?</strong><br>
                                Coconoto provides premium coconut products sourced directly from local farmers, ensuring quality and supporting sustainable agriculture.
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
                        <p style="margin: 5px 0;">© <script>document.write(new Date().getFullYear())</script> Coconoto Enterprise | All Rights Reserved</p>
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
                    <td align="center" style="padding: 15px 25px;">
                        <img src="https://www.coconoto.africa/assets/Logo_1-B3jf7GJB.png" alt="Coconoto Logo" style="height: 30px;" />
                    </td>
                </tr>
            </table>

            <!-- Title Section -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #ffffff; padding: 20px 25px 0 25px;">
                <tr>
                    <td align="center">
                        <h1 style="color: #333333; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; margin: 0 0 5px 0; text-decoration: underline;">New Waitlist Signup</h1>
                    </td>
                </tr>
            </table>

            <!-- Main Content -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; background-color: #ffffff; padding: 25px;">
                <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #333333;">

                        <h2 style="color: #694C39; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">Customer Details:</h2>

                        <!-- Customer Information -->
                        <div style="background-color: #f8f9fa; border-left: 4px solid #694C39; padding: 20px; margin: 0;">
                            <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; white-space: pre-line;">
${orderDetails}
                            </div>
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
                        <p style="margin: 5px 0; font-size: 10px;">© <script>document.write(new Date().getFullYear())</script> Coconoto Internal Communications System</p>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
  `;
}