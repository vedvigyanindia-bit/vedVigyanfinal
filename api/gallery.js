const fs = require("fs");
const path = require("path");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const { slug } = req.query;
  if (!slug) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Slug parameter is required" }));
    return;
  }

  try {
    const frontendDir = path.join(process.cwd(), "frontend");
    const productsBaseDir = path.join(frontendDir, "product", "Ved vigyan products");

    if (!fs.existsSync(productsBaseDir)) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Products base directory not found" }));
      return;
    }

    const folders = fs.readdirSync(productsBaseDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== "Broll and Shoots")
      .map((d) => d.name);

    const folderName = folders.find((f) => slugify(f) === slug);
    if (!folderName) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: `Product folder not found for slug: ${slug}` }));
      return;
    }

    const folderPath = path.join(productsBaseDir, folderName);
    let files = fs.readdirSync(folderPath)
      .filter((f) => !f.startsWith(".") && !f.endsWith(".mp4") && !f.endsWith(".MOV"));

    // Handle empty folders fallback
    if (files.length === 0) {
      if (folderName.includes("Silver Cap")) {
        const fallbackFolder = path.join(productsBaseDir, "Karungali Rudraksh Silver Cap Mala");
        files = fs.readdirSync(fallbackFolder).filter((f) => !f.startsWith("."));
        files = files.map((f) => path.join("..", "Karungali Rudraksh Silver Cap Mala", f));
      } else {
        const fallbackFolder = path.join(productsBaseDir, "Nepali Rudrakasha Mala Close for wearing");
        files = fs.readdirSync(fallbackFolder).filter((f) => !f.startsWith("."));
        files = files.map((f) => path.join("..", "Nepali Rudrakasha Mala Close for wearing", f));
      }
    }

    // Convert files to resolved info objects
    const resolvedFiles = files.map((f) => {
      const fullPath = f.startsWith("..")
        ? path.resolve(productsBaseDir, folderName, f)
        : path.join(folderPath, f);
      
      const relPath = path.relative(frontendDir, fullPath);
      return {
        name: path.basename(f),
        url: "/" + relPath.replace(/\\/g, "/")
      };
    });

    // Keep only images
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
    const imageFiles = resolvedFiles.filter((rf) => {
      const ext = path.extname(rf.name).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Identify certificates
    function isCertificate(name) {
      const fn = name.toLowerCase();
      const fnFolder = (folderName || "").toLowerCase();
      if (fnFolder.includes("kanya") || fnFolder.includes("silver cap karungali") || fnFolder.includes("spatik")) {
        return fn.includes("cert") || fn.includes("lab") || fn.includes("report") || fn.includes("authent") || fn.includes("quality") || fn.includes("verify");
      }
      return fn === "3.webp" || fn.includes("cert") || fn.includes("lab") || fn.includes("report") || fn.includes("authent") || fn.includes("quality") || fn.includes("verify");
    }

    const defaultCert = "/product/Ved vigyan products/5 Mukhi Rudraksh/3.webp";
    const certFileFound = resolvedFiles.find((rf) => isCertificate(rf.name));
    const certificate = certFileFound ? certFileFound.url : defaultCert;

    const certFiles = imageFiles.filter((rf) => isCertificate(rf.name));
    const productFiles = imageFiles.filter((rf) => !isCertificate(rf.name));

    // Sort product files numerically (e.g. 1.png, 2.jpg, 3.webp)
    productFiles.sort((a, b) => {
      const aNum = parseInt(a.name, 10);
      const bNum = parseInt(b.name, 10);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      if (!isNaN(aNum)) return -1;
      if (!isNaN(bNum)) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Build the images array (only include certificate in carousel if a certificate file exists in this product folder)
    let images = [];
    if (certFiles.length > 0) {
      const selectedProducts = productFiles.slice(0, 3);
      const certFile = certFiles[0];
      images = [...selectedProducts, certFile].map((f) => f.url);
    } else {
      const selectedProducts = productFiles.slice(0, 4);
      images = selectedProducts.map((f) => f.url);
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ slug, folderName, images, certificate }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || "Internal Server Error" }));
  }
};
