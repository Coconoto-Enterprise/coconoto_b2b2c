const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ADMIN_EMAIL = 'your@email.com'; // <-- Set your email here
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwm5CW4QZagvFaF2XVnY53nm5n9S9oI2LqzNI8vwfxCsWHuZYttkfMI6C7WAP48QXHqFg/exec';

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const body = JSON.parse(event.body);
  const type = (body.type || '').toLowerCase();

  // Machine order logic (Dehusking, Deshelling, Milk Extractor)
  if (type.includes('machine order') || type.includes('milk extractor')) {
    // Parse extractor_mode if present
    let extractor_mode = null;
    let machineType = body.type;
    if (machineType && machineType.toLowerCase().includes('milk extractor')) {
      if (machineType.toLowerCase().includes('manual')) extractor_mode = 'Manual';
      else if (machineType.toLowerCase().includes('automatic')) extractor_mode = 'Automatic';
      machineType = 'Milk Extractor';
    }

    // Store in Supabase
    const { error } = await supabase
      .from('machine_orders')
      .insert([{
        name: body.name,
        email: body.email,
        phone: body.details?.phone,
        quantity: body.details?.quantity,
        installation_address: body.details?.installationAddress,
        additional_requirements: body.details?.additionalRequirements,
        type: machineType,
        extractor_mode,
        submitted_at: new Date().toISOString()
      }]);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }

    // Send email notification (using Google Apps Script endpoint)
    const emailDetails = `
      New Machine Order Received:\n
      Name: ${body.name}\n
      Email: ${body.email}\n
      Phone: ${body.details?.phone}\n
      Type: ${machineType}${extractor_mode ? ' (' + extractor_mode + ')' : ''}\n
      Quantity: ${body.details?.quantity}\n
      Installation Address: ${body.details?.installationAddress}\n
      Additional Requirements: ${body.details?.additionalRequirements || 'N/A'}
    `;

    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: ADMIN_EMAIL,
        subject: 'New Machine Order',
        message: emailDetails
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order received, stored, and emailed!' }),
    };
  }

  // All other forms (waitlist, contact, product order): forward to Google Apps Script
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.text();
  return {
    statusCode: 200,
    body: data,
  };
};
