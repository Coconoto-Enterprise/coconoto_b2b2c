import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('🔍 Request method:', req.method)
  console.log('🔍 Request headers:', Object.fromEntries(req.headers.entries()))

  try {
    const requestData = await req.json()
    console.log('📧 Raw request data:', requestData)

    // Handle both new and legacy data structures
    const { 
      name, email, message, subject,
      customerName, customerEmail, eventType, formType, formData 
    } = requestData

    const finalName = name || customerName || 'Unknown'
    const finalEmail = email || customerEmail || ''
    const finalMessage = message || `${eventType || 'General Inquiry'}: ${formData ? JSON.stringify(formData) : 'No additional data'}`
    const finalSubject = subject || eventType || formType || 'General Inquiry'

    console.log('📧 Processing email for:', finalName, finalEmail, finalSubject)

    // Validate required fields
    if (!finalName || !finalEmail || !finalMessage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, message' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Email templates
    const businessEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0; font-size: 28px;">🥥 New ${finalSubject}</h1>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin-bottom: 20px;">
            <h2 style="color: #065f46; margin: 0 0 15px 0; font-size: 20px;">Contact Details</h2>
            <p style="margin: 8px 0; color: #374151;"><strong>Name:</strong> ${finalName}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> ${finalEmail}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Type:</strong> ${finalSubject}</p>
          </div>

          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #ea580c;">
            <h3 style="color: #9a3412; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
            <p style="color: #374151; line-height: 1.6; margin: 0;">${finalMessage}</p>
          </div>

          ${formData ? `
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #475569; margin: 0 0 15px 0; font-size: 16px;">Additional Details</h3>
            <pre style="color: #374151; font-size: 12px; background: white; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(formData, null, 2)}</pre>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center;">
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              This email was sent from your Coconoto website.<br>
              Please respond to the customer at: <strong>${finalEmail}</strong>
            </p>
          </div>
        </div>
      </div>
    `

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0; font-size: 28px;">🥥 Thank You for Contacting Coconoto!</h1>
          </div>
          
          <div style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
            <p>Dear ${finalName},</p>
            <p>Thank you for your interest in our <strong>${finalSubject}</strong>! We have received your message and truly appreciate your interest in Coconoto's sustainable coconut solutions.</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
              <h3 style="color: #065f46; margin: 0 0 10px 0;">What happens next?</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>Our team will review your ${finalSubject.toLowerCase()} within 24 hours</li>
                <li>We'll respond with detailed information tailored to your needs</li>
                <li>For urgent matters, feel free to contact us directly</li>
              </ul>
            </div>

            <p>In the meantime, feel free to explore our <strong>sustainable coconut ecosystem</strong> and learn more about our innovative solutions for businesses worldwide.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://coconoto.africa" style="display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Visit Coconoto.africa
            </a>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Best regards,<br>Coconoto Team</p>
            <p>🌍 Building a sustainable coconut economy, one partnership at a time</p>
          </div>
        </div>
      </div>
    `

    console.log('📤 Sending business notification...')

    // Send business notification
    const businessResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Coconoto <notifications@send.coconoto.africa>',
        to: ['info@coconoto.africa'],
        subject: `New ${finalSubject} - ${finalName}`,
        html: businessEmailHtml,
      }),
    })

    if (!businessResponse.ok) {
      const errorText = await businessResponse.text()
      console.error('❌ Business email failed:', errorText)
      throw new Error(`Business email failed: ${businessResponse.status}`)
    }

    const businessResult = await businessResponse.json()
    console.log('✅ Business email sent:', businessResult.id)

    console.log('📤 Sending customer confirmation...')

    // Send customer confirmation
    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Coconoto <hello@send.coconoto.africa>',
        to: [finalEmail],
        subject: 'Thank you for your interest - Coconoto',
        html: customerEmailHtml,
      }),
    })

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text()
      console.error('❌ Customer email failed:', errorText)
      throw new Error(`Customer email failed: ${customerResponse.status}`)
    }

    const customerResult = await customerResponse.json()
    console.log('✅ Customer email sent:', customerResult.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        businessEmailId: businessResult.id,
        customerEmailId: customerResult.id,
        message: 'Emails sent successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send emails', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})