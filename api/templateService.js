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

    // Replace all placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `[${key.toUpperCase()}]`;
      const replacement = value?.toString() || 'N/A';
      processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), replacement);
    });

    // Replace common placeholders
    processedTemplate = processedTemplate.replace(/\[DATE_TIME\]/g, new Date().toLocaleString());
    processedTemplate = processedTemplate.replace(/\[REF_ID\]/g, Math.random().toString(36).substr(2, 9));

    return processedTemplate;
  }

  // Get waitlist email templates
  static getWaitlistTemplates(formData) {
    const systemTemplate = this.loadTemplate('system/waitlist_templet.html');
    const userTemplate = this.loadTemplate('users/user-waitlist.html');

    const templateData = {
      full_name: formData.name,
      email_address: formData.email,
      phone_number: formData.phone,
      company_organization: formData.company,
      account_type: formData.account_type,
      country: formData.country,
      state_province: formData.state,
      city: formData.city,
      seller_business_type: formData.business_type,
      monthly_volume_capacity: formData.monthly_volume,
      years_of_experience: formData.years_experience,
      products_of_interest: formData.products_interested,
      primary_use_case: formData.primary_use_case,
      buyer_business_type: formData.business_type,
      total_waitlist_count: '---', // This would come from database
      name: formData.name,
      email: formData.email,
      company: formData.company,
      business_type: formData.business_type
    };

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
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      user_message: formData.message,
      // User template fields
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
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
      machine_name: machineType,
      amount_quantity: formData.quantity,
      total_price: 'Quote Required',
      customer_name: formData.name || formData.contactName,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_location: formData.installationAddress || formData.installation_address,
      additional_requirements: formData.additionalRequirements || formData.additional_requirements || 'None',
      // User template fields
      name: formData.name || formData.contactName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      machine_type: machineType,
      quantity: formData.quantity,
      installation_address: formData.installationAddress || formData.installation_address
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

    const templateData = {
      product_name: formData.productName || formData.product_name,
      product_name_2: formData.productName2 || '',
      product_quantity: formData.quantity || formData.product_quantity,
      product_quantity_2: formData.quantity2 || '',
      unit_price: formData.unitPrice || formData.unit_price || 'Quote Required',
      unit_price_2: formData.unitPrice2 || '',
      total_price: formData.totalAmount || formData.total_price || 'Quote Required',
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_location: formData.deliveryAddress || formData.address,
      additional_requirements: formData.additionalRequirements || 'None',
      // User template fields
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      quantity: formData.quantity,
      total_amount: formData.totalAmount,
      delivery_address: formData.deliveryAddress
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
      event_type: formData.eventType,
      event_date: formData.eventDate,
      start_time: formData.startTime || formData.eventTime,
      end_time: formData.endTime || 'TBD',
      number_of_guests: formData.numberOfGuests || 'TBD',
      venue_address: formData.venueAddress || formData.location,
      venue_type: formData.venueType || 'TBD',
      serving_style: formData.servingStyle || 'TBD',
      additional_notes: formData.additionalNotes || formData.additionalInfo || 'None',
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_location: formData.location,
      additional_requirements: formData.additionalInfo || 'None',
      // User template fields
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      event_date: formData.eventDate,
      event_time: formData.eventTime,
      location: formData.location
    };

    return {
      systemHtml: this.replacePlaceholders(systemTemplate, templateData),
      userHtml: this.replacePlaceholders(userTemplate, templateData)
    };
  }
}