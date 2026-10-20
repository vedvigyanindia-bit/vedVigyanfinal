const productService = require("../../backend/src/services/productService");

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const products = productService.getAllProducts();
      return sendJson(res, 200, { success: true, count: products.length, products });
    }

    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }

    if (req.method === "POST") {
      const isUpdate = req.query?.action === "update" || body?._action === "update";
      const isDelete = req.query?.action === "delete" || body?._action === "delete";
      const isToggle = req.query?.action === "toggle-stock" || body?._action === "toggle-stock";

      if (isToggle) {
        const { id } = body || {};
        const updated = productService.toggleStock(id);
        return sendJson(res, 200, { success: true, message: "Stock status updated", product: updated });
      }

      if (isDelete) {
        const id = body?.id || req.query?.id;
        const result = productService.deleteProduct(id);
        return sendJson(res, 200, { success: true, message: "Product deleted", result });
      }

      if (isUpdate) {
        const { id, ...updates } = body || {};
        const updated = productService.updateProduct(id, updates);
        return sendJson(res, 200, { success: true, message: "Product updated", product: updated });
      }

      // Add Product
      const newProduct = productService.addProduct(body || {});
      return sendJson(res, 201, { success: true, message: "Product created", product: newProduct });
    }

    if (req.method === "PUT") {
      const { id, ...updates } = body || {};
      const updated = productService.updateProduct(id, updates);
      return sendJson(res, 200, { success: true, message: "Product updated", product: updated });
    }

    if (req.method === "DELETE") {
      const id = req.query?.id || body?.id;
      const result = productService.deleteProduct(id);
      return sendJson(res, 200, { success: true, message: "Product deleted", result });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (err) {
    console.error("[API Admin Products Error]:", err);
    return sendJson(res, 400, { error: err.message || "Failed to process product request" });
  }
};
