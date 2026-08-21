module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let orders = [];
    try {
      const { OrderRepository } = require("../../backend/src/models/Order");
      const filterStatus = req.query?.shiprocketStatus;
      const limit = Number(req.query?.limit || 100);
      const filter = filterStatus ? { shiprocketStatus: filterStatus } : {};
      orders = await OrderRepository.getAll(filter, limit);
    } catch (dbErr) {
      console.warn("[Admin Orders DB Notice]:", dbErr.message);
      orders = [];
    }

    return res.status(200).json({ success: true, count: (orders || []).length, orders: orders || [] });
  } catch (error) {
    console.error("[Admin Orders API Error]:", error);
    return res.status(200).json({ success: true, count: 0, orders: [], note: error.message });
  }
};
