const {
  parseCheckoutPayload,
  saveOrderRecord,
  sendJson,
  validateCheckoutPayload
} = require("../_lib/payments");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const { customer, items, amount } = parseCheckoutPayload(req.body);
    validateCheckoutPayload(customer, items, amount);

    const savedOrder = await saveOrderRecord({
      customer,
      items,
      amount,
      paymentMethod: "cod",
      paymentStatus: "pending"
    });

    sendJson(res, 200, {
      success: true,
      order: {
        id: savedOrder.order_id,
        total: savedOrder.amount,
        items,
        customer,
        payment: "cod",
        paymentStatus: "pending",
        placedAt: savedOrder.created_at
      }
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Unable to place COD order" });
  }
};
