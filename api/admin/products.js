const productService = require("../../backend/src/services/productService");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "GET") {
      const products = productService.getAllProducts();
      return res.status(200).json({ success: true, count: products.length, products });
    }

    if (req.method === "POST") {
      const isUpdate = req.query?.action === "update" || req.body?._action === "update";
      const isDelete = req.query?.action === "delete" || req.body?._action === "delete";
      const isToggle = req.query?.action === "toggle-stock" || req.body?._action === "toggle-stock";

      if (isToggle) {
        const { id } = req.body || {};
        const updated = productService.toggleStock(id);
        return res.status(200).json({ success: true, message: "Stock status updated", product: updated });
      }

      if (isDelete) {
        const id = req.body?.id || req.query?.id;
        const result = productService.deleteProduct(id);
        return res.status(200).json({ success: true, message: "Product deleted", result });
      }

      if (isUpdate) {
        const { id, ...updates } = req.body || {};
        const updated = productService.updateProduct(id, updates);
        return res.status(200).json({ success: true, message: "Product updated", product: updated });
      }

      // Add Product
      const newProduct = productService.addProduct(req.body);
      return res.status(201).json({ success: true, message: "Product created", product: newProduct });
    }

    if (req.method === "PUT") {
      const { id, ...updates } = req.body || {};
      const updated = productService.updateProduct(id, updates);
      return res.status(200).json({ success: true, message: "Product updated", product: updated });
    }

    if (req.method === "DELETE") {
      const id = req.query?.id || req.body?.id;
      const result = productService.deleteProduct(id);
      return res.status(200).json({ success: true, message: "Product deleted", result });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[API Admin Products Error]:", err);
    return res.status(400).json({ error: err.message || "Failed to process product request" });
  }
};
