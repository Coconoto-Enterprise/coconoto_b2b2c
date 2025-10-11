import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Environment Variables
  results.tests.push({
    name: 'Environment Variables',
    status: 'info',
    details: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set ✅' : 'Missing ❌',
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'Set ✅' : 'Missing ❌',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌'
    }
  });

  // Test 2: Resend API Connection
  try {
    console.log('🔍 Testing Resend API...');
    const emailsList = await resend.emails.list({ limit: 5 });
    
    results.tests.push({
      name: 'Resend API Test',
      status: 'success',
      details: {
        connected: true,
        emailCount: emailsList.data?.length || 0,
        emails: emailsList.data || [],
        message: emailsList.data?.length > 0 
          ? `Found ${emailsList.data.length} emails` 
          : 'Connected but no emails found - try sending a test email first'
      }
    });
  } catch (error) {
    console.error('❌ Resend API Error:', error);
    results.tests.push({
      name: 'Resend API Test',
      status: 'error',
      details: {
        connected: false,
        error: error.message,
        suggestion: 'Check if RESEND_API_KEY is valid and has permissions'
      }
    });
  }

  // Test 3: Supabase Connection
  if (supabase) {
    try {
      console.log('🔍 Testing Supabase connection...');
      
      // Test basic connection
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);

      if (tablesError) {
        results.tests.push({
          name: 'Supabase Connection Test',
          status: 'error',
          details: {
            connected: false,
            error: tablesError.message,
            suggestion: 'Check Supabase URL and API key permissions'
          }
        });
      } else {
        // Test YOUR ACTUAL tables
        const actualTables = ['machine_orders', 'waitlist', 'product_orders'];
        let tablesStatus = [];
        let totalOrders = 0;

        for (const tableName of actualTables) {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact' })
              .limit(5);

            if (!error) {
              tablesStatus.push({
                table: tableName,
                status: 'exists',
                count: data?.length || 0
              });
              totalOrders += data?.length || 0;
            } else {
              tablesStatus.push({
                table: tableName,
                status: 'error',
                error: error.message
              });
            }
          } catch (err) {
            tablesStatus.push({
              table: tableName,
              status: 'missing',
              error: err.message
            });
          }
        }

        results.tests.push({
          name: 'Supabase Tables Test',
          status: totalOrders > 0 ? 'success' : 'warning',
          details: {
            connected: true,
            tables: tablesStatus,
            totalOrders: totalOrders,
            message: totalOrders > 0 
              ? `Found ${totalOrders} total orders across your tables` 
              : 'Connected but no orders found in your tables'
          }
        });
      }
    } catch (error) {
      console.error('❌ Supabase Error:', error);
      results.tests.push({
        name: 'Supabase Connection Test',
        status: 'error',
        details: {
          connected: false,
          error: error.message,
          suggestion: 'Check Supabase configuration and network connectivity'
        }
      });
    }
  } else {
    results.tests.push({
      name: 'Supabase Configuration',
      status: 'warning',
      details: {
        configured: false,
        message: 'Supabase environment variables not set'
      }
    });
  }

  // Test 4: Send a test email (if requested)
  if (req.query.sendTest === 'true') {
    try {
      const testEmail = await resend.emails.send({
        from: 'team@coconoto.africa',
        to: ['bamigboyeayomide095@gmail.com'],
        subject: 'Dashboard Test Email - ' + new Date().toLocaleString(),
        html: `
          <h2>🥥 Coconoto Dashboard Test</h2>
          <p>This is a test email sent from your admin dashboard.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Purpose:</strong> Testing email functionality</p>
          <p>If you receive this, your email system is working correctly!</p>
        `
      });

      results.tests.push({
        name: 'Test Email Sent',
        status: 'success',
        details: {
          emailId: testEmail.data?.id,
          message: 'Test email sent successfully'
        }
      });
    } catch (error) {
      results.tests.push({
        name: 'Test Email Failed',
        status: 'error',
        details: {
          error: error.message
        }
      });
    }
  }

  return res.status(200).json(results);
}