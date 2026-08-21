const {
  parseCheckoutPayload,
  sanitizeText,
  sendJson,
  validateCheckoutPayload,
  verifyRazorpaySignature
} = require("../_lib/payments");
const orderService = require("../../backend/src/services/orderService");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const { customer, items, amount: subtotal } = parseCheckoutPayload(req.body);
    const shipping = subtotal >= 999 ? 0 : 99;
    const amount = subtotal + shipping;
    validateCheckoutPayload(customer, items, amount);

    const payment = req.body?.payment || {};
    const razorpayOrderId = sanitizeText(payment.razorpay_order_id, 100);
    const razorpayPaymentId = sanitizeText(payment.razorpay_payment_id, 100);
    const razorpaySignature = sanitizeText(payment.razorpay_signature, 200);

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      sendJson(res, 400, { error: "Incomplete Razorpay payment details" });
      return;
    }

    if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      sendJson(res, 400, { error: "Payment signature verification failed" });
      return;
    }

    console.log(`[Payment Vercel] Razorpay signature verified successfully. Proceeding to Order Service creation...`);

    const orderResult = await orderService.createOrder({
      customer,
      items,
      razorpayOrderId,
      razorpayPaymentId
    });

    if (orderResult.alreadyExists) {
      console.warn(`[Payment Vercel Warning] Duplicate payment verification request for Payment ID: ${razorpayPaymentId}`);
      sendJson(res, 400, { error: "Order already exists" });
      return;
    }

    sendJson(res, 200, {
      success: true,
      order: {
        id: orderResult.order.orderId,
        total: orderResult.order.amount,
        items,
        customer,
        payment: "razorpay",
        paymentStatus: "paid",
        razorpayOrderId,
        razorpayPaymentId,
        placedAt: orderResult.order.date
      }
    });
  } catch (error) {
    console.error(`[Payment Vercel Error] Payment verification and order saving failed:`, error);
    const status = error.statusCode || 500;
    sendJson(res, status, { error: error.message || "Order Saved Failed" });
  }
};
