const { OrderRepository } = require("../../backend/src/models/Order");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filterStatus = req.query.shiprocketStatus;
    const limit = Number(req.query.limit || 100);

    const filter = {};
    if (filterStatus) filter.shiprocketStatus = filterStatus;

    const orders = await OrderRepository.getAll(filter, limit);
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
};
