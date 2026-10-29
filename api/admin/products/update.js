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
    const data = req.body || {};
    const id = data.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "Product ID is required for update" });
    }

    const products = await getAllProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Product with ID "${id}" not found` });
    }

    const currentProduct = products[index];
    const name = String(data.name || currentProduct.name || "").trim();
    const rawSlug = data.slug || currentProduct.slug || name;
    const slug = String(rawSlug)
      .toLowerCase()
      .trim()
      .replace(/[()|]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const price = Number(data.price !== undefined ? data.price : currentProduct.price) || 0;
    const originalPrice = data.originalPrice ? Number(data.originalPrice) : currentProduct.originalPrice;
    let discountPercent = currentProduct.discountPercent || 0;
    if (originalPrice && originalPrice > price) {
      discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    // Handle images
    const filesToUpdate = [];
    let savedImageUrls = [...(currentProduct.images || [currentProduct.image].filter(Boolean))];

    if (Array.isArray(data.uploadedImages) && data.uploadedImages.length > 0) {
      const newUrls = [];
      data.uploadedImages.forEach((imgBase64, idx) => {
        if (typeof imgBase64 === "string" && imgBase64.startsWith("data:image/")) {
          const matches = imgBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches[2]) {
            const ext = matches[1].includes("png") ? "png" : (matches[1].includes("webp") ? "webp" : "jpg");
            const relPath = `frontend/public/images/products/${slug}/${idx + 1}.${ext}`;
            const webUrl = `/public/images/products/${slug}/${idx + 1}.${ext}`;

            filesToUpdate.push({
              path: relPath,
              content: matches[2],
              isBase64: true
            });
            newUrls.push(webUrl);
          }
        } else if (typeof imgBase64 === "string" && (imgBase64.startsWith("/") || imgBase64.startsWith("http"))) {
          newUrls.push(imgBase64);
        }
      });
      if (newUrls.length > 0) {
        savedImageUrls = newUrls;
      }
    }

    if (savedImageUrls.length === 0) {
      savedImageUrls.push("/public/images/logo.jpg");
    }

    const primaryImage = savedImageUrls[0];

    // Bullets
    let bullets = currentProduct.bullets || [];
    if (Array.isArray(data.bullets)) {
      bullets = data.bullets;
    } else if (typeof data.bullets === "string") {
      bullets = data.bullets.split("\n").map(b => b.trim()).filter(Boolean);
    }

    const category = (data.category || currentProduct.category || "rudraksha").toLowerCase().trim();

    const updatedProduct = {
      ...currentProduct,
      category,
      slug,
      name,
      price,
      originalPrice,
      discountPercent,
      image: primaryImage,
      imageAlt: `${name} - Authentic Ved Vigyan Original Product`,
      images: savedImageUrls,
      certificate: savedImageUrls[savedImageUrls.length - 1] || primaryImage,
      short: data.short !== undefined ? data.short : currentProduct.short,
      description: data.description !== undefined ? data.description : currentProduct.description,
      bullets,
      seoTitle: `${name} - Buy Original Online | Ved Vigyan`,
      seoDescription: `Shop original ${name} online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.`,
      url: `/products/${slug}`,
      inStock: data.inStock !== undefined ? (data.inStock === true || data.inStock === "true") : currentProduct.inStock,
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;

    // Add updated files
    filesToUpdate.push({
      path: "backend/data/products.json",
      content: JSON.stringify(products, null, 2)
    });
    filesToUpdate.push({
      path: "frontend/public/js/data.js",
      content: buildDataJs(products)
    });

    const commitResult = await commitFilesToRepo({
      commitMessage: `chore(admin): update product "${name}" (${id}) via live admin panel`,
      filesToUpdate
    });

    return res.status(200).json({
      success: true,
      message: `Product "${name}" updated successfully! Changes will be live in ~30 seconds.`,
      product: updatedProduct,
      commitSha: commitResult.commitSha
    });
  } catch (err) {
    console.error("[API Products UPDATE Error]:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to update product" });
  }
};
