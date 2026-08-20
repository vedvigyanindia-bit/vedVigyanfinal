const orderService = require("../../backend/src/services/orderService");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderId } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }
    const updatedOrder = await orderService.retryShiprocketSync(orderId);
    return res.status(200).json({ success: true, message: "Shiprocket sync retried successfully", order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Shiprocket retry failed" });
  }
};
