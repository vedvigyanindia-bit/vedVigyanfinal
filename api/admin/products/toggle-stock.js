const { getAllProducts, buildDataJs, commitFilesToRepo } = require("../../_lib/githubProductSync");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "Product ID is required" });
    }

    const products = await getAllProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ success: false, error: `Product with ID "${id}" not found` });
    }

    // Toggle
    product.inStock = product.inStock === false ? true : false;

    const filesToUpdate = [
      {
        path: "backend/data/products.json",
        content: JSON.stringify(products, null, 2)
      },
      {
        path: "frontend/public/js/data.js",
        content: buildDataJs(products)
      }
    ];

    const statusText = product.inStock ? "IN STOCK" : "OUT OF STOCK";
    const commitResult = await commitFilesToRepo({
      commitMessage: `chore(admin): mark product "${product.name}" (${id}) as ${statusText}`,
      filesToUpdate
    });

    return res.status(200).json({
      success: true,
      message: `Product "${product.name}" marked as ${statusText}. Updating live in ~30 seconds.`,
      product,
      commitSha: commitResult.commitSha
    });
  } catch (err) {
    console.error("[API Products TOGGLE-STOCK Error]:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to toggle stock" });
  }
};
