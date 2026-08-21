const {
  parseCheckoutPayload,
  sendJson,
  validateCheckoutPayload
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

    const orderResult = await orderService.createCodOrder({
      customer,
      items
    });

    sendJson(res, 200, {
      success: true,
      order: {
        orderId: orderResult.order.orderId,
        id: orderResult.order.orderId,
        total: orderResult.order.amount,
        items,
        customer,
        payment: "cod",
        paymentStatus: "Cash on Delivery (Pending)",
        placedAt: orderResult.order.date
      }
    });
  } catch (error) {
    console.error("[COD API Error]:", error);
    const status = error.statusCode || (error.message && error.message.includes("required") ? 400 : 500);
    sendJson(res, status, { error: error.message || "Unable to place COD order" });
  }
};
