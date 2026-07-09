const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER || 'vedvigyanindia@gmail.com';
const emailPass = process.env.EMAIL_PASS;

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!emailPass) {
    console.warn('[Email Service] Warning: EMAIL_PASS is missing in environment variables. Email sending is disabled.');
    return null;
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  return transporter;
}

/**
 * Returns a high-fidelity, responsive HTML email template for order confirmations.
 */
function getOrderConfirmationHtml(order) {
  return `
    <div style="font-family: 'Outfit', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #faf6f0; padding: 30px; color: #2d150f; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #ebd9c0; overflow: hidden; box-shadow: 0 4px 12px rgba(45, 21, 15, 0.05);">
        
        <!-- Header Banner -->
        <div style="background-color: #9b6b2f; padding: 40px 20px; text-align: center; border-bottom: 3px solid #7d5220;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 500;">VED VIGYAN</h1>
          <p style="color: #ebd9c0; margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 3px;">Ancient Wisdom • Modern Living</p>
        </div>
        
        <!-- Body Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #9b6b2f; margin-top: 0; font-size: 22px; font-weight: 500; line-height: 1.3;">Namaste ${order.customerName},</h2>
          <p style="line-height: 1.6; font-size: 15px; margin: 0 0 25px 0;">
            Thank you for placing your order with **Ved Vigyan**. Your payment has been successfully completed, and your spiritual essentials are booked. 
          </p>
          
          <!-- Order Summary Card -->
          <div style="background-color: #faf6f0; border-radius: 8px; border: 1px solid #ebd9c0; padding: 20px; margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #7e6b66; width: 120px;">Order ID:</td>
                <td style="padding: 4px 0; font-weight: 600; color: #9b6b2f;">${order.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #7e6b66;">Placed At:</td>
                <td style="padding: 4px 0;">${new Date(order.date).toLocaleDateString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #7e6b66;">Payment ID:</td>
                <td style="padding: 4px 0; font-family: monospace;">${order.razorpayPaymentId}</td>
              </tr>
            </table>
            
            <div style="border-top: 1px solid #ebd9c0; margin-top: 15px; padding-top: 15px;">
              <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7e6b66; font-weight: 600;">Items Ordered:</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: 500; line-height: 1.5; color: #2d150f;">
                    ${order.products.replace(/\n/g, '<br>')}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="border-top: 1px solid #ebd9c0; margin-top: 15px; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; font-size: 15px;">Total Price (Incl. Shipping):</span>
              <span style="font-weight: 700; color: #9b6b2f; font-size: 19px;">₹${order.amount}</span>
            </div>
          </div>

          <!-- Shipping Details -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #9b6b2f; font-size: 16px; margin: 0 0 10px 0; font-weight: 600; border-bottom: 1px solid #ebd9c0; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Shipping Address</h3>
            <p style="margin: 0; line-height: 1.6; font-size: 14px; color: #4a3834;">
              <strong>${order.customerName}</strong><br>
              ${order.address}<br>
              ${order.city}, ${order.state} - ${order.pincode}<br>
              Phone: ${order.phone}
            </p>
          </div>

          <!-- Closing note -->
          <div style="border-top: 1px solid #ebd9c0; padding-top: 25px; margin-top: 25px; text-align: center; font-size: 14px; line-height: 1.6;">
            <p style="margin: 0 0 15px 0; color: #5a4b48;">
              Your order is currently being processed and will be packaged with extreme care. We will email you tracking updates as soon as the package is dispatched.
            </p>
            <p style="margin: 0; font-weight: 600; color: #9b6b2f;">
              Thanking you,<br>
              Team Ved Vigyan
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #2d150f; padding: 25px 20px; text-align: center; font-size: 12px; color: #ebd9c0; border-top: 3px solid #ebd9c0;">
          <p style="margin: 0; font-weight: 500;">VED VIGYAN</p>
          <p style="margin: 5px 0 0 0; color: #a8948d;">Dehradun, Uttarakhand, India - 248002</p>
          <p style="margin: 15px 0 0 0; font-size: 11px; color: #8e7b75;">You are receiving this email because you made a purchase on vedvigyan.in.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Sends order confirmation email via Gmail SMTP.
 */
async function sendOrderConfirmation(order) {
  const client = getTransporter();
  if (!client) {
    console.log(`[Email Service] (Skipped) EMAIL_PASS not set. Cannot send confirmation email to ${order.email}`);
    return;
  }

  const mailOptions = {
    from: `"Team Ved Vigyan" <${emailUser}>`,
    to: order.email,
    subject: `Order Confirmed - ${order.orderId} | Team Ved Vigyan`,
    html: getOrderConfirmationHtml(order)
  };

  try {
    const info = await client.sendMail(mailOptions);
    console.log(`[Email Service] Confirmation email sent successfully to ${order.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send order confirmation:`, error.message);
  }
}

async function sendInvoice(order) {
  console.log(`[Email Service] (Invoice Placeholder) For Order ID: ${order.orderId}`);
}

async function sendShippingUpdate(order) {
  console.log(`[Email Service] (Shipping Update Placeholder) For Order ID: ${order.orderId}`);
}

module.exports = {
  sendOrderConfirmation,
  sendInvoice,
  sendShippingUpdate
};
