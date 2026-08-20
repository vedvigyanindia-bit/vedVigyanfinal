const { OrderRepository } = require("../../backend/src/models/Order");
const orderService = require("../../backend/src/services/orderService");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body || {};
    console.log(`[Shiprocket Webhook (Vercel)] Received payload:`, payload);

    const orderId = payload.order_id || payload.custom_order_id;
    const shipmentId = payload.shipment_id;
    const currentStatus = payload.current_status || payload.status;
    const awb = payload.awb || payload.awb_code;
    const courierName = payload.courier_name;

    if (!orderId && !shipmentId) {
      return res.status(400).json({ error: "Missing order_id or shipment_id in webhook payload" });
    }

    let order = null;
    if (orderId) {
      order = await OrderRepository.findByOrderId(orderId);
    }
    if (!order && shipmentId) {
      const allOrders = await OrderRepository.getAll();
      order = allOrders.find((o) => String(o.shiprocketShipmentId) === String(shipmentId));
    }

    if (order) {
      const updatedFields = {
        shiprocketStatus: currentStatus ? currentStatus.toLowerCase() : order.shiprocketStatus,
        orderStatus: currentStatus || order.orderStatus,
        awbCode: awb || order.awbCode,
        courierName: courierName || order.courierName
      };
      await OrderRepository.update(order.orderId, updatedFields);

      if (orderService.updateOrderStatus) {
        orderService.updateOrderStatus(order.orderId, currentStatus).catch((e) => console.warn('[Webhook Sheets Sync Notice]', e.message));
      }
    }

    return res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error(`[Shiprocket Webhook Error]:`, error);
    return res.status(500).json({ error: error.message || "Webhook processing error" });
  }
};
