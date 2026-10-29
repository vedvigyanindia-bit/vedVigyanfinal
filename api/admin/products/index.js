const { getAllProducts, buildDataJs, commitFilesToRepo } = require("../../_lib/githubProductSync");

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. GET ALL PRODUCTS
  if (req.method === "GET") {
    try {
      const products = await getAllProducts();
      return res.status(200).json({
        success: true,
        count: products.length,
        products: products
      });
    } catch (err) {
      console.error("[API Products GET Error]:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to load products" });
    }
  }

  // 2. ADD NEW PRODUCT (POST)
  if (req.method === "POST") {
    try {
      const data = req.body || {};
      const name = String(data.name || "").trim();
      if (!name) {
        return res.status(400).json({ success: false, error: "Product name is required" });
      }

      const products = await getAllProducts();

      // Determine new ID (vv_pXX)
      let maxNum = 0;
      products.forEach(p => {
        if (p.id && p.id.startsWith("vv_p")) {
          const num = parseInt(p.id.replace("vv_p", ""), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
      const id = `vv_p${String(maxNum + 1).padStart(2, "0")}`;

      // Generate slug
      const rawSlug = data.slug || name;
      const slug = String(rawSlug)
        .toLowerCase()
        .trim()
        .replace(/[()|]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const price = Number(data.price) || 0;
      const originalPrice = data.originalPrice ? Number(data.originalPrice) : undefined;
      let discountPercent = 0;
      if (originalPrice && originalPrice > price) {
        discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
      }

      // Process images
      const filesToUpdate = [];
      const savedImageUrls = [];

      if (Array.isArray(data.uploadedImages) && data.uploadedImages.length > 0) {
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
              savedImageUrls.push(webUrl);
            }
          } else if (typeof imgBase64 === "string" && (imgBase64.startsWith("/") || imgBase64.startsWith("http"))) {
            savedImageUrls.push(imgBase64);
          }
        });
      }

      if (savedImageUrls.length === 0) {
        savedImageUrls.push("/public/images/logo.jpg");
      }

      const primaryImage = savedImageUrls[0];

      // Bullets
      let bullets = Array.isArray(data.bullets) ? data.bullets : [];
      if (typeof data.bullets === "string") {
        bullets = data.bullets.split("\n").map(b => b.trim()).filter(Boolean);
      }
      if (bullets.length === 0) {
        bullets = [
          "100% Authentic natural product with laboratory certificate",
          "Energized according to traditional Vedic rituals",
          "Includes authenticity test certificate & usage guide"
        ];
      }

      const category = (data.category || "rudraksha").toLowerCase().trim();
      const tags = Array.isArray(data.tags) ? data.tags : [category, "authentic", "vedic"];

      const newProduct = {
        id,
        category,
        slug,
        name,
        price,
        originalPrice,
        discountPercent,
        rating: Number(data.rating) || 4.8,
        tags,
        image: primaryImage,
        imageAlt: `${name} - Authentic Ved Vigyan Original Product`,
        images: savedImageUrls,
        certificate: savedImageUrls[savedImageUrls.length - 1] || primaryImage,
        short: data.short || `Authentic ${name} sourced and verified by Ved Vigyan.`,
        description: data.description || `${name} is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.`,
        bullets,
        seoTitle: `${name} - Buy Original Online | Ved Vigyan`,
        seoDescription: `Shop original ${name} online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.`,
        url: `/products/${slug}`,
        inStock: data.inStock !== false,
        createdAt: new Date().toISOString()
      };

      products.push(newProduct);

      // Add products.json and data.js to commit
      filesToUpdate.push({
        path: "backend/data/products.json",
        content: JSON.stringify(products, null, 2)
      });
      filesToUpdate.push({
        path: "frontend/public/js/data.js",
        content: buildDataJs(products)
      });

      // Commit to GitHub
      const commitResult = await commitFilesToRepo({
        commitMessage: `feat(admin): add product "${name}" (${id}) via live admin panel`,
        filesToUpdate
      });

      return res.status(200).json({
        success: true,
        message: `Product "${name}" published live! Auto-deploying in ~30 seconds.`,
        product: newProduct,
        commitSha: commitResult.commitSha
      });
    } catch (err) {
      console.error("[API Products POST Error]:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to create product" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
};
