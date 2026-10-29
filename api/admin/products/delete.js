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
      return res.status(400).json({ success: false, error: "Product ID is required for deletion" });
    }

    const products = await getAllProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Product with ID "${id}" not found` });
    }

    const removedProduct = products.splice(index, 1)[0];

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

    const commitResult = await commitFilesToRepo({
      commitMessage: `chore(admin): delete product "${removedProduct.name}" (${id}) via live admin panel`,
      filesToUpdate
    });

    return res.status(200).json({
      success: true,
      message: `Product "${removedProduct.name}" deleted successfully. Deleting from live site in ~30 seconds.`,
      product: removedProduct,
      commitSha: commitResult.commitSha
    });
  } catch (err) {
    console.error("[API Products DELETE Error]:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to delete product" });
  }
};
