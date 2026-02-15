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
    const { email, password } = req.body;

    console.log('🔐 Buyer login attempt:', email);

    // Get buyer from database
    const { data: buyer, error: fetchError } = await supabase
      .from('buyers')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (fetchError || !buyer) {
      console.log('❌ Buyer not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, buyer.password_hash);

    if (!passwordMatch) {
      console.log('❌ Invalid password');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Remove password hash from response
    const { password_hash, ...buyerData } = buyer;

    console.log('✅ Buyer login successful');
    return res.status(200).json({
      success: true,
      buyer: buyerData
    });

  } catch (error) {
    console.error('❌ Buyer login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
}
