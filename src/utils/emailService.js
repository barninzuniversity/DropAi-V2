import emailjs from '@emailjs/browser';

// EmailJS service configuration
// You'll need to sign up at https://www.emailjs.com/ and create templates for orders, contact, and sharing
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id'; // Replace with your EmailJS service ID
const ORDER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID || 'template_order'; // Replace with your order template ID
const CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_contact'; // Replace with your contact form template ID
const SHARE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_SHARE_TEMPLATE_ID || 'template_share'; // Replace with your share template ID
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'user_id'; // Replace with your EmailJS user ID

// Default recipient email for order notifications and contact form submissions
const SHOP_EMAIL = 'barninzshop@gmail.com';

// Lazy initialization approach - only initialize when needed
let emailjsInitialized = false;

// Async initialization function that will only be called when an email function is used
export const initializeEmailJS = async () => {
  // If already initialized, don't initialize again
  if (emailjsInitialized) return true;
  
  try {
    // Check if USER_ID is valid before initializing
    if (USER_ID && USER_ID !== 'user_id') {
      emailjs.init(USER_ID);
      emailjsInitialized = true;
      // Only log initialization in development environment
      if (import.meta.env.DEV) {
        console.log('EmailJS initialized successfully');
      }
      return true;
    } else {
      console.warn('EmailJS not initialized: Invalid or missing USER_ID');
      // We'll still allow the app to function without email capabilities
      return false;
    }
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

// No automatic initialization on import - will be initialized on-demand when email functions are called

// Default recipient email for order notifications and contact form submissions


/**
 * Send order notification email
 * @param {Object} orderData - Order data including customer info, items, payment details
 * @returns {Promise} - Promise resolving to the email sending result
 */
export const sendOrderNotification = async (orderData) => {
  try {
    // Try to initialize EmailJS if not already initialized
    if (!emailjsInitialized) {
      const initResult = await initializeEmailJS();
      if (!initResult) {
        console.error('EmailJS initialization failed. Email services are unavailable.');
        return {
          success: false,
          error: 'Email service is not available',
          details: { message: 'EmailJS initialization failed' }
        };
      }
    }
    
    if (!SERVICE_ID || SERVICE_ID === 'service_id' || 
        !ORDER_TEMPLATE_ID || ORDER_TEMPLATE_ID === 'template_order' || 
        !USER_ID || USER_ID === 'user_id') {
      console.error('EmailJS configuration is incomplete. Please check your environment variables.');
      return {
        success: false,
        error: 'Email service configuration is incomplete',
        details: { message: 'Missing required configuration values' }
      };
    }
    
    // Log the EmailJS configuration only in development environment
    if (import.meta.env.DEV) {
      console.log('EmailJS Configuration:', {
        serviceID: SERVICE_ID,
        templateID: ORDER_TEMPLATE_ID,
        userID: USER_ID ? 'Set' : 'Not set'
      });
    }
    
    // Format order items for email template
    const formattedItems = orderData.items.map(item => (
      `${item.name} (${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    )).join('\n');
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + shipping + tax;
    
    // Prepare template parameters
    const templateParams = {
      to_email: SHOP_EMAIL,
      from_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      from_email: orderData.customer.email || SHOP_EMAIL, // Fallback if customer email is not provided
      order_number: orderData.orderNumber,
      order_date: new Date(orderData.orderDate).toLocaleDateString(),
      customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      customer_email: orderData.customer.email || 'Not provided',
      customer_phone: orderData.customer.phone || 'Not provided',
      shipping_address: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} ${orderData.customer.zipCode}, ${orderData.customer.country}`,
      order_items: formattedItems,
      subtotal: `$${subtotal.toFixed(2)}`,
      shipping: shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`,
      tax: `$${tax.toFixed(2)}`,
      total: `$${total.toFixed(2)}`,
      payment_method: orderData.payment.method,
      payment_status: orderData.payment.status
    };
    
    console.log('Sending order email to:', SHOP_EMAIL);
    
    // Send email using EmailJS
    const result = await emailjs.send(SERVICE_ID, ORDER_TEMPLATE_ID, templateParams);
    console.log('Order notification sent successfully:', result.text);
    
    // Also send a confirmation email to the customer if they provided an email
    if (orderData.customer.email) {
      try {
        // Modify template params to send to customer
        const customerTemplateParams = {
          ...templateParams,
          to_email: orderData.customer.email,
          from_email: SHOP_EMAIL,
          from_name: 'Barninz Shop'
        };
        
        const customerResult = await emailjs.send(SERVICE_ID, ORDER_TEMPLATE_ID, customerTemplateParams);
        console.log('Order confirmation sent to customer:', customerResult.text);
      } catch (customerEmailError) {
        console.error('Failed to send confirmation to customer:', customerEmailError);
        // Don't throw this error as we still want to consider the order successful
      }
    } else {
      console.log('No customer email provided, skipping customer confirmation email');
    }
    
    return result;
  } catch (error) {
    console.error('Failed to send order notification:', error);
    console.error('Error details:', error.message);
    if (error.text) console.error('Error text:', error.text);
    
    // Return a standardized error object instead of throwing
    // This allows the checkout process to continue even if email fails
    return {
      success: false,
      error: error.message || 'Failed to send email notification',
      details: error
    };
  }
};

/**
 * Send contact form submission
 * @param {Object} contactData - Contact form data
 * @returns {Promise} - Promise resolving to the email sending result
 */
export const sendContactForm = async (contactData) => {
  try {
    // Try to initialize EmailJS if not already initialized
    if (!emailjsInitialized) {
      const initResult = await initializeEmailJS();
      if (!initResult) {
        console.error('EmailJS initialization failed. Email services are unavailable.');
        return {
          success: false,
          error: 'Email service is not available',
          details: { message: 'EmailJS initialization failed' }
        };
      }
    }
    
    // Validate EmailJS configuration
    if (!SERVICE_ID || SERVICE_ID === 'service_id' || 
        !CONTACT_TEMPLATE_ID || CONTACT_TEMPLATE_ID === 'template_contact' || 
        !USER_ID || USER_ID === 'user_id') {
      console.error('EmailJS configuration is incomplete. Please check your environment variables.');
      return {
        success: false,
        error: 'Email service configuration is incomplete',
        details: { message: 'Missing required configuration values' }
      };
    }
    
    // Prepare template parameters
    const templateParams = {
      to_email: SHOP_EMAIL,
      from_name: contactData.name,
      from_email: contactData.email,
      subject: contactData.subject || 'Contact Form Submission',
      message: contactData.message
    };
    
    // Send email using EmailJS
    const result = await emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams, USER_ID);
    console.log('Contact form sent successfully:', result.text);
    return result;
  } catch (error) {
    console.error('Failed to send contact form:', error);
    // Return a standardized error object instead of throwing
    return {
      success: false,
      error: error.message || 'Failed to send contact form',
      details: error
    };
  }
};

/**
 * Share product via email
 * @param {Object} productData - Product data to share
 * @param {string} recipientEmail - Email address to send to
 * @returns {Promise} - Promise resolving to the email sending result
 */
export const shareProductViaEmail = async (productData, recipientEmail) => {
  try {
    // Try to initialize EmailJS if not already initialized
    if (!emailjsInitialized) {
      const initResult = await initializeEmailJS();
      if (!initResult) {
        console.error('EmailJS initialization failed. Email services are unavailable.');
        return {
          success: false,
          error: 'Email service is not available',
          details: { message: 'EmailJS initialization failed' }
        };
      }
    }
    
    // Validate EmailJS configuration
    if (!SERVICE_ID || SERVICE_ID === 'service_id' || 
        !SHARE_TEMPLATE_ID || SHARE_TEMPLATE_ID === 'template_share' || 
        !USER_ID || USER_ID === 'user_id') {
      console.error('EmailJS configuration is incomplete. Please check your environment variables.');
      return {
        success: false,
        error: 'Email service configuration is incomplete',
        details: { message: 'Missing required configuration values' }
      };
    }
    
    // Format price with discount if applicable
    const price = productData.discount > 0 
      ? `$${(productData.price - (productData.price * (productData.discount / 100))).toFixed(2)} (${productData.discount}% OFF)`
      : `$${productData.price.toFixed(2)}`;
    
    // Prepare template parameters
    const templateParams = {
      to_email: recipientEmail,
      from_email: SHOP_EMAIL,
      product_name: productData.name,
      product_price: price,
      product_description: productData.description,
      product_url: `${window.location.origin}/products/${productData.id}`,
      product_image: productData.image
    };
    
    // Send email using EmailJS
    const result = await emailjs.send(SERVICE_ID, SHARE_TEMPLATE_ID, templateParams, USER_ID);
    console.log('Product shared successfully:', result.text);
    return result;
  } catch (error) {
    console.error('Failed to share product:', error);
    // Return a standardized error object instead of throwing
    return {
      success: false,
      error: error.message || 'Failed to share product',
      details: error
    };
  }
};