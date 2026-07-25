const googleSheets = require('./googleSheets');
const emailService = require('./email');

async function createOrder({ customer, items, razorpayOrderId, razorpayPaymentId }) {
  // Duplicate check
  const existingOrder = await googleSheets.findOrderByPaymentId(razorpayPaymentId);
  if (existingOrder) {
    console.warn(`[Order Service] Order already exists for Payment ID: ${razorpayPaymentId}`);
    return {
      alreadyExists: true,
      order: existingOrder
    };
  }

  // Calculate amount
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const amount = subtotal + shipping;

  // Generate Order ID
  const orderId = await googleSheets.getNextOrderId();

  // Create products list text
  const products = items.map(item => `${item.name} ×${item.qty}`).join('\n');
  const quantity = items.reduce((sum, item) => sum + item.qty, 0);

  const orderData = {
    orderId,
    date: new Date().toISOString(),
    customerName: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    pincode: customer.pincode,
    products,
    quantity,
    amount,
    razorpayOrderId,
    razorpayPaymentId,
    paymentStatus: 'Paid',
    orderStatus: 'Pending'
  };

  try {
    await googleSheets.appendOrder(orderData);
  } catch (err) {
    console.error(`[Order Service Error] Google Sheets append failed:`, err);
    throw new Error('Order Saved Failed');
  }

  // Optional placeholder call (disabled/noop for now)
  try {
    await emailService.sendOrderConfirmation(orderData);
  } catch (err) {
    console.error(`[Order Service Error] Optional email sending failed:`, err);
  }

  return {
    alreadyExists: false,
    order: orderData
  };
}

async function findOrderByPaymentId(paymentId) {
  return await googleSheets.findOrderByPaymentId(paymentId);
}

async function updateOrderStatus(orderId, status) {
  return await googleSheets.updateOrderStatus(orderId, status);
}

async function createCodOrder({ customer, items }) {
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const amount = subtotal + shipping;

  const orderId = await googleSheets.getNextOrderId();
  const products = items.map(item => `${item.name} ×${item.qty}`).join('\n');
  const quantity = items.reduce((sum, item) => sum + item.qty, 0);

  const orderData = {
    orderId,
    date: new Date().toISOString(),
    customerName: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    pincode: customer.pincode,
    products,
    quantity,
    amount,
    razorpayOrderId: 'COD-' + Date.now(),
    razorpayPaymentId: 'COD-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    paymentStatus: 'Cash on Delivery (Pending)',
    orderStatus: 'Pending'
  };

  try {
    await googleSheets.appendOrder(orderData);
  } catch (err) {
    console.warn(`[Order Service Notice] Google Sheets append fallback:`, err.message);
  }

  try {
    await emailService.sendOrderConfirmation(orderData);
  } catch (err) {
    console.warn(`[Order Service Notice] Email confirmation fallback:`, err.message);
  }

  return {
    alreadyExists: false,
    order: orderData
  };
}

module.exports = {
  createOrder,
  createCodOrder,
  findOrderByPaymentId,
  updateOrderStatus
};
