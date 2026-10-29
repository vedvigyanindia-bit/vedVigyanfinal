const { sendJson } = require("../_lib/payments");
const { OrderRepository } = require("../../backend/src/models/Order");

module.exports = async function handler(req, res) {
  // POST: Retry Shiprocket sync
  if (req.method === "POST") {
    try {
      const orderService = require("../../backend/src/services/orderService");
      const { orderId } = req.body || {};
      if (!orderId) {
        return res.status(400).json({ error: "orderId is required" });
      }
      const updatedOrder = await orderService.retryShiprocketSync(orderId);
      return res.status(200).json({ success: true, message: "Shiprocket sync retried successfully", order: updatedOrder });
    } catch (error) {
      console.error("[Shiprocket Retry Error]:", error);
      return res.status(500).json({ error: error.message || "Shiprocket retry failed" });
    }
  }

  // GET: Fetch all orders
  if (req.method === "GET") {
    try {
      const filterStatus = req.query?.shiprocketStatus;
      const limit = Number(req.query?.limit || 100);
      const filter = filterStatus ? { shiprocketStatus: filterStatus } : {};

      const orders = await OrderRepository.getAll(filter, limit);
      return sendJson(res, 200, {
        success: true,
        count: (orders || []).length,
        orders: orders || []
      });
    } catch (error) {
      console.error("[Admin Orders API Error]:", error);
      return sendJson(res, 500, { error: error.message || "Failed to fetch orders" });
    }
  }

  return sendJson(res, 405, { error: "Method not allowed" });
};
