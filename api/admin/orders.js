const { sendJson } = require("../_lib/payments");
const { OrderRepository } = require("../../backend/src/models/Order");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const filterStatus = req.query?.shiprocketStatus;
    const limit = Number(req.query?.limit || 100);
    const filter = filterStatus ? { shiprocketStatus: filterStatus } : {};

    const orders = await OrderRepository.getAll(filter, limit);
    sendJson(res, 200, {
      success: true,
      count: (orders || []).length,
      orders: orders || []
    });
  } catch (error) {
    console.error("[Admin Orders API Error]:", error);
    sendJson(res, 500, { error: error.message || "Failed to fetch orders" });
  }
};
