const crypto = require("crypto");

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function sanitizeText(value, maxLength = 250) {
  return String(value || "").trim().slice(0, maxLength);
}

function sanitizeCustomer(customer = {}) {
  return {
    name: sanitizeText(customer.name, 120),
    phone: sanitizeText(customer.phone, 30),
    address: sanitizeText(customer.address, 500),
    city: sanitizeText(customer.city, 120),
    state: sanitizeText(customer.state, 120),
    pincode: sanitizeText(customer.pincode, 20),
    email: sanitizeText(customer.email, 150)
  };
}

function sanitizeItems(items = []) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      id: sanitizeText(item.id, 80),
      name: sanitizeText(item.name, 200),
      qty: Math.max(1, Number(item.qty || 0)),
      price: Math.max(0, Number(item.price || 0)),
      url: sanitizeText(item.url, 300),
      image: sanitizeText(item.image, 300)
    }))
    .filter((item) => item.id && item.name && Number.isFinite(item.qty) && Number.isFinite(item.price));
}

function calculateAmount(items) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function createReceipt() {
  return `vv_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
}

function createInternalOrderId() {
  return `VV${Date.now().toString().slice(-8)}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

async function createRazorpayOrder(amount, receipt) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Missing Razorpay credentials");
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      payment_capture: 1
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    const reason = payload?.error?.description || "Unable to create Razorpay order";
    throw new Error(reason);
  }

  return payload;
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Missing Razorpay secret");
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return digest === signature;
}

function parseCheckoutPayload(body = {}) {
  const customer = sanitizeCustomer(body.customer);
  const items = sanitizeItems(body.items);
  const amount = calculateAmount(items);

  return { customer, items, amount };
}

function validateCheckoutPayload(customer, items, amount) {
  if (
    !customer.name ||
    !customer.phone ||
    !customer.email ||
    !customer.address ||
    !customer.city ||
    !customer.state ||
    !customer.pincode
  ) {
    throw new Error("Full name, phone, email, address, city, state, and pincode are required");
  }

  if (!items.length || amount <= 0) {
    throw new Error("Cart is empty or invalid");
  }
}

module.exports = {
  createInternalOrderId,
  createRazorpayOrder,
  createReceipt,
  parseCheckoutPayload,
  sendJson,
  sanitizeText,
  validateCheckoutPayload,
  verifyRazorpaySignature
};
