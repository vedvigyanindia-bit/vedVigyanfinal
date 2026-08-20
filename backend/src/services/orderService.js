const { OrderRepository } = require('../models/Order');
const shiprocketService = require('./shiprocketService');
const googleSheets = require('./googleSheets');
const emailService = require('./email');

function formatProductName(item) {
  const isFree = item.isFreeGift || item.id === 'free_5_mukhi_rudraksha' || (item.name && item.name.toLowerCase().includes('free'));
  return isFree ? `🎁 [FREE GIFT CLAIMED] ${item.name} ×${item.qty}` : `${item.name} ×${item.qty}`;
}

function generateUniqueOrderId() {
  return `VV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
}

/**
 * Creates order after verified payment or for prepaid flow
 */
async function createOrder({ customer, items, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  // Duplicate payment check in Database (Source of Truth)
  if (razorpayPaymentId) {
    const existingOrder = await OrderRepository.findByPaymentId(razorpayPaymentId);
    if (existingOrder) {
      console.warn(`[Order Service] Order already exists for Payment ID: ${razorpayPaymentId}`);
      return { alreadyExists: true, order: existingOrder };
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const amount = subtotal + shipping;
  const quantity = items.reduce((sum, item) => sum + item.qty, 0);
  const orderId = generateUniqueOrderId();

  const newOrderData = {
    orderId,
    customer,
    items,
    quantity,
    amount,
    paymentMethod: 'Prepaid',
    paymentStatus: 'paid',
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    shiprocketStatus: 'pending',
    orderStatus: 'Pending'
  };

  // Step 1: Save to Database (Primary Source of Truth)
  const savedOrder = await OrderRepository.create(newOrderData);

  // Step 2: Trigger Shiprocket adhoc order creation post payment verification
  try {
    const shiprocketRes = await shiprocketService.createShiprocketOrder(savedOrder);
    const updatedFields = {
      shiprocketStatus: 'synced',
      shiprocketOrderId: shiprocketRes.shiprocketOrderId,
      shiprocketShipmentId: shiprocketRes.shiprocketShipmentId,
      awbCode: shiprocketRes.awbCode,
      courierName: shiprocketRes.courierName,
      shiprocketSyncedAt: new Date().toISOString()
    };
    await OrderRepository.update(savedOrder.orderId, updatedFields);
    Object.assign(savedOrder, updatedFields);
  } catch (err) {
    console.error(`[Order Service Error] Shiprocket sync failed for ${savedOrder.orderId}:`, err.message);
    const updatedFields = {
      shiprocketStatus: 'failed',
      shiprocketLastError: err.message
    };
    await OrderRepository.update(savedOrder.orderId, updatedFields);
    Object.assign(savedOrder, updatedFields);
  }

  // Step 3: Asynchronously sync to Google Sheets (Non-blocking backup)
  syncToSheetsAsync(savedOrder);

  // Step 4: Asynchronously send email confirmation
  try {
    await emailService.sendOrderConfirmation({
      orderId: savedOrder.orderId,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      pincode: customer.pincode,
      products: items.map(formatProductName).join('\n'),
      quantity,
      amount,
      paymentStatus: 'Paid',
      orderStatus: savedOrder.orderStatus
    });
  } catch (err) {
    console.warn(`[Order Service Notice] Email confirmation fallback:`, err.message);
  }

  return { alreadyExists: false, order: savedOrder };
}

/**
 * Creates Cash on Delivery (COD) Order
 */
async function createCodOrder({ customer, items }) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const amount = subtotal + shipping;
  const quantity = items.reduce((sum, item) => sum + item.qty, 0);
  const orderId = generateUniqueOrderId();

  const newOrderData = {
    orderId,
    customer,
    items,
    quantity,
    amount,
    paymentMethod: 'COD',
    paymentStatus: 'Cash on Delivery (Pending)',
    razorpayOrderId: `COD-${Date.now()}`,
    razorpayPaymentId: `COD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    shiprocketStatus: 'pending',
    orderStatus: 'Pending'
  };

  // Step 1: Save to Database (Source of Truth)
  const savedOrder = await OrderRepository.create(newOrderData);

  // Step 2: Trigger Shiprocket adhoc order creation
  try {
    const shiprocketRes = await shiprocketService.createShiprocketOrder(savedOrder);
    const updatedFields = {
      shiprocketStatus: 'synced',
      shiprocketOrderId: shiprocketRes.shiprocketOrderId,
      shiprocketShipmentId: shiprocketRes.shiprocketShipmentId,
      awbCode: shiprocketRes.awbCode,
      courierName: shiprocketRes.courierName,
      shiprocketSyncedAt: new Date().toISOString()
    };
    await OrderRepository.update(savedOrder.orderId, updatedFields);
    Object.assign(savedOrder, updatedFields);
  } catch (err) {
    console.error(`[Order Service Error] Shiprocket sync failed for COD ${savedOrder.orderId}:`, err.message);
    const updatedFields = {
      shiprocketStatus: 'failed',
      shiprocketLastError: err.message
    };
    await OrderRepository.update(savedOrder.orderId, updatedFields);
    Object.assign(savedOrder, updatedFields);
  }

  // Step 3: Asynchronously sync to Google Sheets (Non-blocking)
  syncToSheetsAsync(savedOrder);

  // Step 4: Asynchronously send email confirmation
  try {
    await emailService.sendOrderConfirmation({
      orderId: savedOrder.orderId,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      pincode: customer.pincode,
      products: items.map(formatProductName).join('\n'),
      quantity,
      amount,
      paymentStatus: 'Cash on Delivery (Pending)',
      orderStatus: savedOrder.orderStatus
    });
  } catch (err) {
    console.warn(`[Order Service Notice] Email confirmation fallback:`, err.message);
  }

  return { alreadyExists: false, order: savedOrder };
}

/**
 * Manually retry Shiprocket Order Creation for a failed order
 */
async function retryShiprocketSync(orderId) {
  const order = await OrderRepository.findByOrderId(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  try {
    const shiprocketRes = await shiprocketService.createShiprocketOrder(order);
    const updatedFields = {
      shiprocketStatus: 'synced',
      shiprocketOrderId: shiprocketRes.shiprocketOrderId,
      shiprocketShipmentId: shiprocketRes.shiprocketShipmentId,
      awbCode: shiprocketRes.awbCode,
      courierName: shiprocketRes.courierName,
      shiprocketLastError: null,
      shiprocketSyncedAt: new Date().toISOString()
    };
    const updated = await OrderRepository.update(orderId, updatedFields);
    syncToSheetsAsync(updated);
    return updated;
  } catch (err) {
    await OrderRepository.update(orderId, {
      shiprocketStatus: 'failed',
      shiprocketLastError: err.message
    });
    throw err;
  }
}

/**
 * Helper to sync DB record to Google Sheets asynchronously without throwing or blocking
 */
function syncToSheetsAsync(order) {
  setImmediate(async () => {
    try {
      const sheetData = {
        orderId: order.orderId,
        date: order.createdAt || new Date().toISOString(),
        customerName: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        address: order.customer.address,
        city: order.customer.city,
        state: order.customer.state,
        pincode: order.customer.pincode,
        products: (order.items || []).map(formatProductName).join('\n'),
        quantity: order.quantity,
        amount: order.amount,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        paymentStatus: order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus,
        orderStatus: order.orderStatus || 'Pending'
      };
      await googleSheets.appendOrder(sheetData);
    } catch (err) {
      console.warn(`[Order Service Notice] Google Sheets async sync failed:`, err.message);
    }
  });
}

async function findOrderByPaymentId(paymentId) {
  return await OrderRepository.findByPaymentId(paymentId);
}

async function updateOrderStatus(orderId, status) {
  return await OrderRepository.update(orderId, { orderStatus: status });
}

module.exports = {
  createOrder,
  createCodOrder,
  retryShiprocketSync,
  findOrderByPaymentId,
  updateOrderStatus
};
