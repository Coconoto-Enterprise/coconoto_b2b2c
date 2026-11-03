/**
 * Email Type Mapper
 * Maps form types to email configuration types for consistent routing
 */

export function mapFormTypeToEmailType(formType: string): string {
  const formTypeNormalized = (formType || '').toLowerCase().trim();

  // Waitlist signup variants
  if (formTypeNormalized.includes('waitlist')) {
    return 'waitlist_signup';
  }

  // Contact form variants
  if (formTypeNormalized.includes('contact')) {
    return 'contact_inquiry';
  }

  // Machine order variants
  if (
    formTypeNormalized.includes('machine') ||
    formTypeNormalized.includes('desheller') ||
    formTypeNormalized.includes('dehusker') ||
    formTypeNormalized.includes('milk extractor')
  ) {
    return 'machine_order';
  }

  // Product order variants
  if (formTypeNormalized.includes('product')) {
    return 'product_order';
  }

  // Husk sale variants
  if (formTypeNormalized.includes('husk') || formTypeNormalized.includes('coconut husk')) {
    return 'husk_sale';
  }

  // Event booking variants
  if (formTypeNormalized.includes('booking') || formTypeNormalized.includes('event')) {
    return 'event_booking';
  }

  // Default
  return 'internal_notification';
}

/**
 * Get friendly email type display name
 */
export function getEmailTypeDisplayName(emailType: string): string {
  const displayNames: Record<string, string> = {
    waitlist_signup: 'Waitlist Signup',
    contact_inquiry: 'Contact Inquiry',
    machine_order: 'Machine Order',
    product_order: 'Product Order',
    husk_sale: 'Husk Sale',
    event_booking: 'Event Booking',
    internal_notification: 'Internal Notification'
  };

  return displayNames[emailType] || emailType.replace(/_/g, ' ');
}
