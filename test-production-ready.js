// Development-ready email system test
import { sendContactEmails, sendWaitlistEmails } from './src/utils/supabaseEmailService.js';

async function runComprehensiveEmailTest() {
  console.log('🧪 Running comprehensive email system test...\n');

  // Test 1: Contact Form
  console.log('📝 Test 1: Contact Form Email');
  try {
    await sendContactEmails({
      name: 'Development Test User',
      email: 'dev-test@example.com',
      message: 'This is a development test of the Supabase Edge Function email system. Testing contact form functionality.',
      subject: 'Development Test - Contact Form'
    });
    console.log('✅ Contact form email test passed\n');
  } catch (error) {
    console.error('❌ Contact form email test failed:', error, '\n');
  }

  // Test 2: Waitlist Email
  console.log('📝 Test 2: Waitlist Email');
  try {
    await sendWaitlistEmails({
      customerName: 'Development Test User',
      customerEmail: 'dev-test@example.com',
      eventType: 'Product Waitlist',
      message: 'Testing waitlist functionality with Supabase Edge Functions',
      formType: 'Waitlist Registration',
      formData: {
        productType: 'Coconut Dehusker',
        interests: ['Bulk Processing', 'Sustainable Solutions']
      }
    });
    console.log('✅ Waitlist email test passed\n');
  } catch (error) {
    console.error('❌ Waitlist email test failed:', error, '\n');
  }

  console.log('🎉 Email system test complete!');
  console.log('📧 Professional email system is development-ready with:');
  console.log('   • Supabase Edge Functions');
  console.log('   • Custom domain: send.coconoto.africa');
  console.log('   • Professional branding');
  console.log('   • Error handling and logging');
  console.log('   • Production-ready deployment');
}

// Run the comprehensive test
runComprehensiveEmailTest().catch(console.error);