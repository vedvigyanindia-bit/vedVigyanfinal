const shiprocketService = require("../../backend/src/services/shiprocketService");
const { OrderRepository } = require("../../backend/src/models/Order");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let shipmentId = req.query.shipment_id;
    const orderId = req.query.order_id;

    if (!shipmentId && orderId) {
      const order = await OrderRepository.findByOrderId(orderId);
      if (order && order.shiprocketShipmentId) {
        shipmentId = order.shiprocketShipmentId;
      }
    }

    if (!shipmentId) {
      return res.status(400).json({ error: "shipment_id or valid order_id is required" });
    }

    const data = await shiprocketService.trackShipment(shipmentId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Tracking lookup failed" });
  }
};
