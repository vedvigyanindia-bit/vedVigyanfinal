const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const orderService = require("./services/orderService");
const shiprocketService = require("./services/shiprocketService");
const { OrderRepository } = require("./models/Order");

// Validate required environment variables
const requiredEnv = [
  "PORT",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "GOOGLE_SHEET_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY"
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`[Error] Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}


const FRONTEND_ROOT = path.join(__dirname, "..", "..", "frontend");
const port = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache"
  });
  res.end(JSON.stringify(payload));
}

function sendFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(data);
  });
}

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const requested = cleanPath === "/" ? "/index.html" : cleanPath;
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  return path.join(FRONTEND_ROOT, normalized);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

function sanitizeText(value, maxLength = 250) {
  return String(value || "").trim().slice(0, maxLength);
}

function sanitizeCustomer(customer = {}) {
  return {
    name: sanitizeText(customer.name, 120),
    phone: sanitizeText(customer.phone, 30),
    address: sanitizeText(customer.address, 500),
    city: sanitizeText(customer.city, 120),
    state: sanitizeText(customer.state, 120),
    pincode: sanitizeText(customer.pincode, 20),
    email: sanitizeText(customer.email, 150)
  };
}

function sanitizeItems(items = []) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      id: sanitizeText(item.id || item.slug || item.name || `item_${Math.random().toString(36).substring(2, 8)}`, 80),
      name: sanitizeText(item.name || item.title || "Spiritual Item", 200),
      qty: Math.max(1, Number(item.qty || item.quantity || 1)),
      price: Math.max(0, Number(item.price ?? 0)),
      url: sanitizeText(item.url || "", 300),
      image: sanitizeText(item.image || "", 300)
    }))
    .filter((item) => item.name && Number.isFinite(item.qty) && Number.isFinite(item.price));
}

function calculateAmount(items) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function createReceipt() {
  return `vv_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
}

function createInternalOrderId() {
  return `VV${Date.now().toString().slice(-8)}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

async function createRazorpayOrder(amount, receipt) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Missing Razorpay credentials");
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      payment_capture: 1
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    const reason = payload?.error?.description || "Unable to create Razorpay order";
    throw new Error(reason);
  }

  return payload;
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Missing Razorpay secret");
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return digest === signature;
}



async function handleCreateRazorpayOrder(req, res) {
  try {
    const { customer: rawCustomer, items: rawItems } = await readJsonBody(req);
    const customer = sanitizeCustomer(rawCustomer);
    const items = sanitizeItems(rawItems);
    const subtotal = calculateAmount(items);
    const prepaidDiscount = Math.round(subtotal * 0.05); // 5% Prepaid Discount
    const shipping = subtotal >= 999 ? 0 : 99;
    const amount = subtotal - prepaidDiscount + shipping;

    console.log(`[Payment] Creating Razorpay order for customer: ${customer.name}, subtotal: INR ${subtotal}, discount: INR ${prepaidDiscount}, amount: INR ${amount}`);

    if (
      !customer.name ||
      !customer.phone ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      console.warn(`[Payment Warning] Order creation failed: Missing customer details`);
      sendJson(res, 400, { error: "Full name, phone, email, address, city, state, and pincode are required" });
      return;
    }

    if (!items.length || subtotal <= 0) {
      console.warn(`[Payment Warning] Order creation failed: Cart is empty or invalid`);
      sendJson(res, 400, { error: "Cart is empty or invalid" });
      return;
    }

    const receipt = createReceipt();
    const razorpayOrder = await createRazorpayOrder(amount, receipt);

    console.log(`[Payment] Razorpay order created successfully: ${razorpayOrder.id}`);

    sendJson(res, 200, {
      keyId: process.env.RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      receipt,
      razorpayOrder
    });
  } catch (error) {
    console.error(`[Payment Error] Failed to create Razorpay order:`, error);
    sendJson(res, 500, { error: error.message || "Unable to create payment order" });
  }
}

async function handleVerifyRazorpayPayment(req, res) {
  try {
    const body = await readJsonBody(req);
    const customer = sanitizeCustomer(body.customer);
    const items = sanitizeItems(body.items);
    const subtotal = calculateAmount(items);
    const prepaidDiscount = Math.round(subtotal * 0.05); // 5% Prepaid Discount
    const shipping = subtotal >= 999 ? 0 : 99;
    const amount = subtotal - prepaidDiscount + shipping;
    const payment = body.payment || {};
    const razorpayOrderId = sanitizeText(payment.razorpay_order_id, 100);
    const razorpayPaymentId = sanitizeText(payment.razorpay_payment_id, 100);
    const razorpaySignature = sanitizeText(payment.razorpay_signature, 200);

    console.log(`[Payment] Verifying Razorpay payment signature for Razorpay Order ID: ${razorpayOrderId}`);

    if (
      !customer.name ||
      !customer.phone ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      console.warn(`[Payment Warning] Verification failed: Missing customer details`);
      sendJson(res, 400, { error: "Full name, phone, email, address, city, state, and pincode are required" });
      return;
    }

    if (!items.length || subtotal <= 0) {
      console.warn(`[Payment Warning] Verification failed: Cart is empty or invalid`);
      sendJson(res, 400, { error: "Cart is empty or invalid" });
      return;
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      console.warn(`[Payment Warning] Verification failed: Incomplete payment details`);
      sendJson(res, 400, { error: "Incomplete Razorpay payment details" });
      return;
    }

    if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      console.error(`[Payment Error] Payment signature verification failed for Order ID: ${razorpayOrderId}`);
      sendJson(res, 400, { error: "Payment signature verification failed" });
      return;
    }

    console.log(`[Payment] Razorpay signature verified successfully. Proceeding to Order Service creation...`);

    try {
      const orderResult = await orderService.createOrder({
        customer,
        items,
        razorpayOrderId,
        razorpayPaymentId
      });

      if (orderResult.alreadyExists) {
        console.warn(`[Payment Warning] Duplicate payment verification request for Payment ID: ${razorpayPaymentId}`);
        sendJson(res, 400, { error: "Order already exists" });
        return;
      }

      console.log(`[Payment] Order created and verified successfully in Google Sheets. Returning success to client.`);

      sendJson(res, 200, {
        success: true,
        order: {
          id: orderResult.order.orderId,
          total: orderResult.order.amount,
          items,
          customer,
          payment: "razorpay",
          paymentStatus: "paid",
          razorpayOrderId,
          razorpayPaymentId,
          placedAt: orderResult.order.date
        }
      });
    } catch (orderError) {
      console.error(`[Payment Error] Payment verification and order saving failed:`, orderError);
      sendJson(res, 500, { error: orderError.message || "Order Saved Failed" });
    }
  } catch (error) {
    console.error(`[Payment Error] Payment verification failed:`, error);
    sendJson(res, 500, { error: error.message || "Unable to verify payment" });
  }
}

async function handleCreateCodOrder(req, res) {
  try {
    const body = await readJsonBody(req);
    const customer = sanitizeCustomer(body.customer);
    const items = sanitizeItems(body.items);

    if (
      !customer.name ||
      !customer.phone ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      sendJson(res, 400, { error: "Full name, phone, email, address, city, state, and pincode are required" });
      return;
    }

    if (!items.length) {
      sendJson(res, 400, { error: "Cart is empty" });
      return;
    }

    const orderResult = await orderService.createCodOrder({ customer, items });

    sendJson(res, 200, {
      success: true,
      message: "COD Order Placed Successfully",
      order: {
        orderId: orderResult.order.orderId,
        total: orderResult.order.amount,
        items,
        customer,
        payment: "cod",
        paymentStatus: "Cash on Delivery (Pending)",
        placedAt: orderResult.order.date
      }
    });
  } catch (error) {
    console.error(`[COD Order Error] Failed to process COD order:`, error);
    sendJson(res, 500, { error: error.message || "Unable to place COD order" });
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function handleGetGallery(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      sendJson(res, 400, { error: "Slug parameter is required" });
      return;
    }

    const productsBaseDir = path.join(FRONTEND_ROOT, "product", "Ved vigyan products");
    if (!fs.existsSync(productsBaseDir)) {
      sendJson(res, 404, { error: "Products base directory not found" });
      return;
    }

    const folders = fs.readdirSync(productsBaseDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== "Broll and Shoots")
      .map((d) => d.name);

    const folderName = folders.find((f) => slugify(f) === slug);
    if (!folderName) {
      sendJson(res, 404, { error: `Product folder not found for slug: ${slug}` });
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
      
      const relPath = path.relative(FRONTEND_ROOT, fullPath);
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

    sendJson(res, 200, { slug, folderName, images, certificate });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal Server Error" });
  }
}

async function handleCheckPincode(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pincode = url.searchParams.get("pincode");
    const weight = Number(url.searchParams.get("weight") || 0.5);
    const isCod = url.searchParams.get("isCod") === "true" || url.searchParams.get("isCod") === "1";

    if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
      sendJson(res, 400, { serviceable: false, message: "Valid 6-digit Indian Pincode is required" });
      return;
    }

    const result = await shiprocketService.checkPincodeServiceability(pincode.trim(), weight, isCod);
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, { serviceable: false, message: error.message || "Pincode serviceability check failed" });
  }
}

async function handleTrackShipment(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let shipmentId = url.searchParams.get("shipment_id");
    const orderId = url.searchParams.get("order_id");

    if (!shipmentId && orderId) {
      const order = await OrderRepository.findByOrderId(orderId);
      if (order && order.shiprocketShipmentId) {
        shipmentId = order.shiprocketShipmentId;
      }
    }

    if (!shipmentId) {
      sendJson(res, 400, { error: "shipment_id or valid order_id is required" });
      return;
    }

    const data = await shiprocketService.trackShipment(shipmentId);
    sendJson(res, 200, data);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Tracking lookup failed" });
  }
}

async function handleShiprocketWebhook(req, res) {
  try {
    const payload = await readJsonBody(req);
    console.log(`[Shiprocket Webhook] Received payload:`, payload);

    const orderId = payload.order_id || payload.custom_order_id;
    const shipmentId = payload.shipment_id;
    const currentStatus = payload.current_status || payload.status;
    const awb = payload.awb || payload.awb_code;
    const courierName = payload.courier_name;

    if (!orderId && !shipmentId) {
      sendJson(res, 400, { error: "Missing order_id or shipment_id in webhook payload" });
      return;
    }

    // Step 1: Update Database (Primary Source of Truth)
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
      
      // Step 2: Asynchronously update Google Sheets
      if (orderService.updateOrderStatus) {
        orderService.updateOrderStatus(order.orderId, currentStatus).catch((e) => console.warn('[Webhook Sheets Sync Notice]', e.message));
      }
    }

    sendJson(res, 200, { success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error(`[Shiprocket Webhook Error]:`, error);
    sendJson(res, 500, { error: error.message || "Webhook processing error" });
  }
}

async function handleGetAdminOrders(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const filterStatus = url.searchParams.get("shiprocketStatus");
    const limit = Number(url.searchParams.get("limit") || 100);

    const filter = {};
    if (filterStatus) filter.shiprocketStatus = filterStatus;

    const orders = await OrderRepository.getAll(filter, limit);
    sendJson(res, 200, { success: true, count: orders.length, orders });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Failed to fetch orders" });
  }
}

async function handleRetryShiprocketSync(req, res) {
  try {
    const { orderId } = await readJsonBody(req);
    if (!orderId) {
      sendJson(res, 400, { error: "orderId is required" });
      return;
    }
    const updatedOrder = await orderService.retryShiprocketSync(orderId);
    sendJson(res, 200, { success: true, message: "Shiprocket sync retried successfully", order: updatedOrder });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Shiprocket retry failed" });
  }
}

async function handleGenerateShiprocketLabel(req, res) {
  try {
    const { shipmentId } = await readJsonBody(req);
    if (!shipmentId) {
      sendJson(res, 400, { error: "shipmentId is required" });
      return;
    }
    const result = await shiprocketService.generateLabel([shipmentId]);
    sendJson(res, 200, { success: true, labelData: result });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Label generation failed" });
  }
}

function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`);

  if (req.method === "GET" && url.pathname === "/api/gallery") {
    handleGetGallery(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/shiprocket/check-pincode") {
    handleCheckPincode(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/shiprocket/track") {
    handleTrackShipment(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/shiprocket/webhook") {
    handleShiprocketWebhook(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/orders") {
    handleGetAdminOrders(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/orders/shiprocket-retry") {
    handleRetryShiprocketSync(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/orders/shiprocket-label") {
    handleGenerateShiprocketLabel(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/payments/config") {
    sendJson(res, 200, {
      keyId: process.env.RAZORPAY_KEY_ID || "",
      currency: "INR"
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/payments/create-order") {
    handleCreateRazorpayOrder(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/payments/verify") {
    handleVerifyRazorpayPayment(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/orders/cod") {
    handleCreateCodOrder(req, res);
    return;
  }

  const filePath = resolvePath(req.url);
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(filePath, res);
      return;
    }

    const fallbackPath = path.join(filePath, "index.html");
    fs.stat(fallbackPath, (fallbackErr, fallbackStat) => {
      if (!fallbackErr && fallbackStat.isFile()) {
        sendFile(fallbackPath, res);
        return;
      }

      sendFile(path.join(FRONTEND_ROOT, "index.html"), res);
    });
  });
}

const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`Ved Vigyan running on http://localhost:${port}`);
});

