const {
  createRazorpayOrder,
  createReceipt,
  parseCheckoutPayload,
  sendJson,
  validateCheckoutPayload
} = require("../_lib/payments");

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

    const receipt = createReceipt();
    const razorpayOrder = await createRazorpayOrder(amount, receipt);

    sendJson(res, 200, {
      keyId: process.env.RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      receipt,
      razorpayOrder
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Unable to create payment order" });
  }
};
