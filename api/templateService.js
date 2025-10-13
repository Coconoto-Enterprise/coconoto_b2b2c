import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  // Get waitlist count from database
  static async getWaitlistCount() {
    try {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error getting waitlist count:', error);
        return 'Unable to fetch';
      }
      
      const totalCount = count || 0;
      console.log(`📊 Current waitlist count: ${totalCount}`);
      
      // Format the count nicely
      if (totalCount === 0) {
        return 'First member! 🎉';
      } else if (totalCount < 100) {
        return `${totalCount} members and growing!`;
      } else if (totalCount < 1000) {
        return `${totalCount}+ members strong!`;
      } else {
        return `${Math.floor(totalCount/1000)}K+ members!`;
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      return 'Growing community!';
    }
  }

  // Get waitlist email templates
  static async getWaitlistTemplates(formData) {
    console.log('📧 Getting waitlist templates for:', JSON.stringify(formData, null, 2));
    
    const systemTemplate = this.loadTemplate('system/waitlist_templet.html');
    const userTemplate = this.loadTemplate('users/user-waitlist.html');

    // Convert primary_use_case to readable format
    const formatPrimaryUseCase = (value) => {
      if (!value) return 'N/A';
      return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Convert account_type to readable format
    const formatAccountType = (value) => {
      if (!value) return 'N/A';
      return value.charAt(0).toUpperCase() + value.slice(1);
    };

    // Convert business_type to readable format
    const formatBusinessType = (value) => {
      if (!value) return 'N/A';
      const formatted = value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return formatted;
    };

    // Determine what fields to show based on account type
    const isSeller = formData.account_type === 'seller' || formData.account_type === 'both';
    const isBuyer = formData.account_type === 'buyer' || formData.account_type === 'both';

    const templateData = {
      // System template placeholders
      full_name: formData.name || 'N/A',
      email_address: formData.email || 'N/A',
      phone_number: formData.phone || 'N/A',
      company_organization: formData.company || 'N/A',
      account_type: formatAccountType(formData.account_type),
      country: formData.country || 'N/A',
      state_province: formData.state || 'N/A',
      city: formData.city || 'N/A',
      
      // Seller-specific fields (only show if seller)
      seller_business_type: isSeller ? formatBusinessType(formData.business_type) : '',
      business_type: isSeller ? formatBusinessType(formData.business_type) : '', // For system template
      monthly_volume_capacity: isSeller ? (formData.monthly_volume || 'N/A') : '',
      years_of_experience: isSeller ? (formData.years_experience || 'N/A') : '',
      
      // Buyer-specific fields (only show if buyer)  
      products_of_interest: isBuyer ? (Array.isArray(formData.products_interested) 
        ? formData.products_interested.join(', ') 
        : (formData.products_interested || 'N/A')) : '',
      other_products: isBuyer && formData.products_other ? formData.products_other : '',
      primary_use_case: isBuyer ? formatPrimaryUseCase(formData.primary_use_case) : '',
      buyer_business_type: '', // Remove this field entirely for buyers
      
      // Additional information
      additional_info: formData.additional_info || 'None',
      hear_about_us: formData.hear_about_us || 'Not specified',
      
      total_waitlist_count: await this.getWaitlistCount(),
      
      // User template placeholders (simpler format)
      name: formData.name || 'N/A',
      email: formData.email || 'N/A',
      company: formData.company || 'N/A',
      business_type: isSeller ? formatBusinessType(formData.business_type) : '' // Only for sellers
    };

    console.log('📧 Template data for waitlist:', JSON.stringify(templateData, null, 2));

    // Handle conditional sections for waitlist template
    let processedSystemTemplate = systemTemplate;
    
    // Remove seller-specific rows if not a seller
    if (!isSeller) {
      processedSystemTemplate = processedSystemTemplate
        .replace(/<tr>\s*<td[^>]*>Business Type<\/td>\s*<td[^>]*>\[SELLER_BUSINESS_TYPE\]<\/td>\s*<\/tr>/gs, '')
        .replace(/<tr>\s*<td[^>]*>Monthly Volume Capacity<\/td>\s*<td[^>]*>\[MONTHLY_VOLUME_CAPACITY\]<\/td>\s*<\/tr>/gs, '')
        .replace(/<tr>\s*<td[^>]*>Years of Experience<\/td>\s*<td[^>]*>\[YEARS_OF_EXPERIENCE\]<\/td>\s*<\/tr>/gs, '');
    }
    
    // Remove buyer-specific rows if not a buyer
    if (!isBuyer) {
      processedSystemTemplate = processedSystemTemplate
        .replace(/<tr>\s*<td[^>]*>Products of Interest \*<\/td>\s*<td[^>]*>\[PRODUCTS_OF_INTEREST\]<\/td>\s*<\/tr>/gs, '')
        .replace(/<tr>\s*<td[^>]*>Other Products<\/td>\s*<td[^>]*>\[OTHER_PRODUCTS\]<\/td>\s*<\/tr>/gs, '')
        .replace(/<tr>\s*<td[^>]*>Primary Use Case<\/td>\s*<td[^>]*>\[PRIMARY_USE_CASE\]<\/td>\s*<\/tr>/gs, '');
    }
    
    // Remove "Other Products" row if no other products specified
    if (!formData.products_other || formData.products_other.trim() === '') {
      processedSystemTemplate = processedSystemTemplate
        .replace(/<tr>\s*<td[^>]*>Other Products<\/td>\s*<td[^>]*>\[OTHER_PRODUCTS\]<\/td>\s*<\/tr>/gs, '');
    }
    
    // Always remove "Business Type (Buyer)" row since we only show business type for sellers
    processedSystemTemplate = processedSystemTemplate
      .replace(/<tr>\s*<td[^>]*>Business Type \(Buyer\)<\/td>\s*<td[^>]*>\[BUYER_BUSINESS_TYPE\]<\/td>\s*<\/tr>/gs, '');

    // Process user template similarly
    let processedUserTemplate = userTemplate;
    
    // Remove "Business Type" row from user template if not a seller
    if (!isSeller) {
      processedUserTemplate = processedUserTemplate
        .replace(/<tr>\s*<td[^>]*>Business Type<\/td>\s*<td[^>]*>\[BUSINESS_TYPE\]<\/td>\s*<\/tr>/gs, '');
    }
    
    // Remove "Other Products" row from user template if no other products specified
    if (!formData.products_other || formData.products_other.trim() === '') {
      processedUserTemplate = processedUserTemplate
        .replace(/<tr>\s*<td[^>]*>Other Products<\/td>\s*<td[^>]*>\[OTHER_PRODUCTS\]<\/td>\s*<\/tr>/gs, '');
    }

    return {
      systemHtml: this.replacePlaceholders(processedSystemTemplate, templateData),
      userHtml: this.replacePlaceholders(processedUserTemplate, templateData)
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