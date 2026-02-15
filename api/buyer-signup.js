import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      address,
      city,
      state,
      country,
      postal_code
    } = req.body;

    console.log('📝 Buyer signup attempt:', email);

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert buyer into database
    const { data: buyer, error: insertError } = await supabase
      .from('buyers')
      .insert([{
        email,
        password_hash: passwordHash,
        first_name,
        last_name,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        country: country || null,
        postal_code: postal_code || null
      }])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Buyer signup error:', insertError);
      
      if (insertError.message.includes('duplicate') || insertError.code === '23505') {
        return res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Signup failed'
      });
    }

    // Remove password hash from response
    const { password_hash, ...buyerData } = buyer;

    console.log('✅ Buyer signup successful');
    return res.status(201).json({
      success: true,
      buyer: buyerData
    });

  } catch (error) {
    console.error('❌ Buyer signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Signup failed'
    });
  }
}
