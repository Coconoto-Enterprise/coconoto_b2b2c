// Test the Supabase Edge Function
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dberjfpwxwahgdyubqdr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZXJqZnB3eHdhaGdkeXVicWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MDc1MzAsImV4cCI6MjA0NzA4MzUzMH0.VT7hHa1ycwN9OHU0b2F7Vt7GrTX6cEDALjYXxEm_BMs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEdgeFunction() {
  console.log('🧪 Testing Supabase Edge Function...')
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from Supabase Edge Function',
        subject: 'Test Email - Edge Function'
      },
    })

    if (error) {
      console.error('❌ Edge Function error:', error)
      return
    }

    console.log('✅ Edge Function response:', data)
    console.log('🎉 Edge Function test completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testEdgeFunction()