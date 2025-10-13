import fs from 'fs';
import path from 'path';

// Template service to load and process HTML email templates
export class TemplateService {
  static templateCache = new Map();

  // Load template from file system
  static loadTemplate(templatePath) {
    if (this.templateCache.has(templatePath)) {
      return this.templateCache.get(templatePath);
    }

    try {
      const fullPath = path.join(process.cwd(), 'templates', templatePath);
      const template = fs.readFileSync(fullPath, 'utf-8');
      this.templateCache.set(templatePath, template);
      return template;
    } catch (error) {
      console.error(`Failed to load template: ${templatePath}`, error);
      throw new Error(`Template not found: ${templatePath}`);
    }
  }

  // Replace placeholders in template with actual data
  static replacePlaceholders(template, data) {
    let processedTemplate = template;

    // First, replace common placeholders to avoid conflicts
    processedTemplate = processedTemplate.replace(/\[DATE_TIME\]/g, new Date().toLocaleString());
    processedTemplate = processedTemplate.replace(/\[REF_ID\]/g, Math.random().toString(36).substr(2, 9));
    
    // Create a safe replacement map to avoid recursive replacements
    const replacements = new Map();
    
    // Prepare all replacements first
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `[${key.toUpperCase()}]`;
      let replacement = '';
      
      if (value !== null && value !== undefined) {
        replacement = String(value).trim();
        // Clean up any potential circular replacement issues
        replacement = replacement.replace(/\[.*?\]/g, ''); // Remove any brackets that might cause issues
      } else {
        replacement = 'N/A';
      }
      
      replacements.set(placeholder, replacement);
    });
    
    // Apply all replacements
    replacements.forEach((replacement, placeholder) => {
      // Use a more precise regex that matches the exact placeholder
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      processedTemplate = processedTemplate.replace(regex, replacement);
    });

    return processedTemplate;
  }

  // Get waitlist email templates
  static getWaitlistTemplates(formData) {
    console.log('📧 Getting waitlist templates for:', JSON.stringify(formData, null, 2));
    
    const systemTemplate = this.loadTemplate('system/waitlist_templet.html');
    const userTemplate = this.loadTemplate('users/user-waitlist.html');

    const templateData = {
      // System template placeholders
      full_name: formData.name || 'N/A',
      email_address: formData.email || 'N/A',
      phone_number: formData.phone || 'N/A',
      company_organization: formData.company || 'N/A',
      account_type: formData.account_type || 'N/A',
      country: formData.country || 'N/A',
      state_province: formData.state || 'N/A',
      city: formData.city || 'N/A',
      seller_business_type: formData.business_type || 'N/A',
      monthly_volume_capacity: formData.monthly_volume || 'N/A',
      years_of_experience: formData.years_experience || 'N/A',
      products_of_interest: Array.isArray(formData.products_interested) 
        ? formData.products_interested.join(', ') 
        : (formData.products_interested || 'N/A'),
      primary_use_case: formData.primary_use_case || 'N/A',
      buyer_business_type: formData.business_type || 'N/A',
      total_waitlist_count: '---', // This would come from database
      
      // User template placeholders (simpler format)
      name: formData.name || 'N/A',
      email: formData.email || 'N/A',
      company: formData.company || 'N/A',
      business_type: formData.business_type || 'N/A'
    };

    console.log('📧 Template data for waitlist:', JSON.stringify(templateData, null, 2));

    return {
      systemHtml: this.replacePlaceholders(systemTemplate, templateData),
      userHtml: this.replacePlaceholders(userTemplate, templateData)
    };
  }

  // Get contact form email templates
  static getContactTemplates(formData) {
    const systemTemplate = this.loadTemplate('system/contact_template.html');
    const userTemplate = this.loadTemplate('users/user-contact.html');

    const templateData = {
      // System template placeholders (from ServicesContact form)
      customer_name: formData.name || 'N/A',
      customer_email: formData.email || 'N/A', 
      customer_phone: formData.phone || 'N/A',
      user_message: formData.message || 'N/A',
      
      // User template fields
      name: formData.name || 'N/A',
      email: formData.email || 'N/A',
      phone: formData.phone || 'N/A',
      message: formData.message || 'N/A',
      subject: formData.subject || 'Contact Inquiry'
    };

    return {
      systemHtml: this.replacePlaceholders(systemTemplate, templateData),
      userHtml: this.replacePlaceholders(userTemplate, templateData)
    };
  }

  // Get machine order email templates
  static getMachineTemplates(formData, machineType = 'Machine') {
    const systemTemplate = this.loadTemplate('system/machine_templet.html');
    const userTemplate = this.loadTemplate('users/user-machine.html');

    const templateData = {
      // System template placeholders (from OrderDeshellerModal, etc.)
      machine_name: machineType,
      amount_quantity: formData.quantity || 'N/A',
      total_price: 'Quote Required',
      customer_name: formData.name || formData.contactName || 'N/A',
      customer_email: formData.email || 'N/A',
      customer_phone: formData.phone || 'N/A',
      customer_location: formData.installationAddress || formData.installation_address || 'N/A',
      additional_requirements: formData.additionalRequirements || formData.additional_requirements || 'None',
      
      // User template fields
      name: formData.name || formData.contactName || 'N/A',
      email: formData.email || 'N/A',
      phone: formData.phone || 'N/A',
      company: formData.company || 'N/A',
      machine_type: machineType,
      quantity: formData.quantity || 'N/A',
      installation_address: formData.installationAddress || formData.installation_address || 'N/A'
    };

    return {
      systemHtml: this.replacePlaceholders(systemTemplate, templateData),
      userHtml: this.replacePlaceholders(userTemplate, templateData)
    };
  }

  // Get product order email templates  
  static getProductTemplates(formData) {
    const systemTemplate = this.loadTemplate('system/product_templet.html');
    const userTemplate = this.loadTemplate('users/user-product.html');

    // Extract cart items if available (from ProductCheckoutModal)
    const cartItems = formData.cart || [];
    const product1 = cartItems[0] || {};
    const product2 = cartItems[1] || {};

    const templateData = {
      // System template placeholders (from ProductCheckoutModal)
      product_name: product1.name || formData.productName || formData.product_name || 'N/A',
      product_name_2: product2.name || formData.productName2 || '',
      product_quantity: product1.quantity || formData.quantity || formData.product_quantity || 'N/A',
      product_quantity_2: product2.quantity || formData.quantity2 || '',
      unit_price: product1.price || formData.unitPrice || formData.unit_price || 'Quote Required',
      unit_price_2: product2.price || formData.unitPrice2 || '',
      total_price: formData.total || formData.totalAmount || formData.total_price || 'Quote Required',
      customer_name: formData.name || 'N/A',
      customer_email: formData.email || 'N/A',
      customer_phone: formData.phone || 'N/A',
      customer_location: formData.address || formData.deliveryAddress || 'N/A',
      additional_requirements: formData.notes || formData.additionalRequirements || 'None',
      
      // User template fields
      name: formData.name || 'N/A',
      email: formData.email || 'N/A',
      phone: formData.phone || 'N/A',
      quantity: formData.quantity || product1.quantity || 'N/A',
      total_amount: formData.total || formData.totalAmount || 'N/A',
      delivery_address: formData.address || formData.deliveryAddress || 'N/A'
    };

    return {
      systemHtml: this.replacePlaceholders(systemTemplate, templateData),
      userHtml: this.replacePlaceholders(userTemplate, templateData)
    };
  }

  // Get booking email templates
  static getBookingTemplates(formData) {
    const systemTemplate = this.loadTemplate('system/booking_templet.html');
    const userTemplate = this.loadTemplate('users/user-booking.html');

    const templateData = {
      // System template placeholders (from BookEventModal)
      event_type: formData.eventType || 'N/A',
      event_date: formData.eventDate || 'N/A',
      start_time: formData.startTime || formData.eventTime || 'N/A',
      end_time: formData.endTime || 'TBD',
      number_of_guests: formData.guests || formData.numberOfGuests || 'TBD',
      venue_address: formData.venue || formData.venueAddress || formData.location || 'N/A',
      venue_type: formData.venueType || 'TBD',
      serving_style: Array.isArray(formData.servingStyle) 
        ? formData.servingStyle.join(', ') 
        : (formData.servingStyle || 'TBD'),
      additional_notes: formData.notes || formData.additionalNotes || formData.additionalInfo || 'None',
      customer_name: formData.fullName || formData.name || 'N/A',
      customer_email: formData.email || 'N/A',
      customer_phone: formData.phone || 'N/A',
      customer_location: formData.venue || formData.location || 'N/A',
      additional_requirements: formData.notes || formData.additionalInfo || 'None',
      
      // User template fields
      name: formData.fullName || formData.name || 'N/A',
      email: formData.email || 'N/A',
      phone: formData.phone || 'N/A',
      event_date: formData.eventDate || 'N/A',
      event_time: formData.startTime || formData.eventTime || 'N/A',
      location: formData.venue || formData.location || 'N/A'
    };

    return {
      systemHtml: this.replacePlaceholders(systemTemplate, templateData),
      userHtml: this.replacePlaceholders(userTemplate, templateData)
    };
  }
}