const { sendJson } = require("../_lib/payments");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const orderService = require("../../backend/src/services/orderService");
    const { OrderRepository } = require("../../backend/src/models/Order");
    const filterStatus = req.query?.shiprocketStatus;
    const limit = Number(req.query?.limit || 100);
    const filter = filterStatus ? { shiprocketStatus: filterStatus } : {};

    let debugNotice = "";
    try {
      await OrderRepository.connectMongoIfNeeded();
    } catch (e) {
      debugNotice = e.message;
    }

    const orders = await orderService.getOrders(filter, limit);
    sendJson(res, 200, {
      success: true,
      count: (orders || []).length,
      orders: orders || [],
      mongoConnected: OrderRepository.isMongoConnected(),
      debugNotice
    });
  } catch (error) {
    console.error("[Admin Orders API Error]:", error);
    sendJson(res, 200, { success: true, count: 0, orders: [], note: error.message });
  }
};
