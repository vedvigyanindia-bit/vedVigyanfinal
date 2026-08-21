const dotenv = require('dotenv');
dotenv.config();

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let tokenCache = {
  token: null,
  expiresAt: 0
};

async function getAuthToken() {
  const email = (process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_EMAIL !== "vedvigyanindia@gmail.com") ? process.env.SHIPROCKET_EMAIL : "joshimahima798@gmail.com";
  const password = (process.env.SHIPROCKET_PASSWORD && process.env.SHIPROCKET_PASSWORD !== "Vedindia@123$" && process.env.SHIPROCKET_PASSWORD !== "vedvigyan@123") ? process.env.SHIPROCKET_PASSWORD : "Ua8qgL3dqRDGYCdA%ra9&60lN3Uki%Qf";

  if (!email || !password) {
    throw new Error('Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD in environment');
  }

  // Use cached token if valid (buffer 10 minutes)
  if (tokenCache.token && tokenCache.expiresAt > Date.now() + 10 * 60 * 1000) {
    return tokenCache.token;
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text || 'Invalid JSON response from Shiprocket auth' };
  }

  if (!response.ok || !data.token) {
    const reason = data.message || (data.errors ? JSON.stringify(data.errors) : 'Shiprocket login failed');
    throw new Error(`Shiprocket Auth Error: ${reason}`);
  }

  // Token valid for 10 days
  tokenCache.token = data.token;
  tokenCache.expiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return data.token;
}

async function requestShiprocket(endpoint, method = 'GET', body = null) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text || 'Invalid JSON response from Shiprocket API' };
  }

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : `HTTP ${response.status}`);
    throw new Error(`Shiprocket API Error (${endpoint}): ${errorMsg}`);
  }

  return data;
}

function parseName(fullName = '') {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || 'Customer';
  const lastName = parts.slice(1).join(' ') || '.';
  return { firstName, lastName };
}

/**
 * Creates an ad-hoc shipment order in Shiprocket
 */
async function createShiprocketOrder(order) {
  const { firstName, lastName } = parseName(order.customer.name);
  const pickupLocation = (process.env.SHIPROCKET_PICKUP_LOCATION && process.env.SHIPROCKET_PICKUP_LOCATION.length < 30) ? process.env.SHIPROCKET_PICKUP_LOCATION : 'work';
  
  const formattedItems = (order.items || []).map((item, idx) => ({
    name: item.name || `Product ${idx + 1}`,
    sku: item.id || `SKU-${idx + 1}`,
    units: Math.max(1, Number(item.qty || 1)),
    selling_price: Number(item.price || 0),
    discount: 0,
    hsn: ''
  }));

  const payload = {
    order_id: String(order.orderId),
    order_date: new Date(order.createdAt || Date.now()).toISOString().replace('T', ' ').slice(0, 19),
    pickup_location: pickupLocation,
    channel_id: '',
    comment: 'Order placed via Ved Vigyan web app',
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: order.customer.address || 'Address',
    billing_address_2: '',
    billing_city: order.customer.city || 'City',
    billing_pincode: String(order.customer.pincode || '').trim(),
    billing_state: order.customer.state || 'State',
    billing_country: 'India',
    billing_email: order.customer.email || 'customer@vedvigyan.local',
    billing_phone: String(order.customer.phone || '').trim(),
    shipping_is_billing: true,
    order_items: formattedItems,
    payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
    shipping_charges: order.amount >= 999 ? 0 : 99,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: Number(order.amount || 0),
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5
  };

  const response = await requestShiprocket('/orders/create/adhoc', 'POST', payload);
  return {
    success: true,
    shiprocketOrderId: response.order_id,
    shiprocketShipmentId: response.shipment_id,
    status: response.status,
    statusCode: response.status_code,
    awbCode: response.awb_code || null,
    courierName: response.courier_name || null,
    rawResponse: response
  };
}

/**
 * Checks Pincode Serviceability & Delivery Time
 */
async function checkPincodeServiceability(deliveryPincode, weight = 0.5, isCod = false) {
  const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '110001';
  const codFlag = isCod ? 1 : 0;
  const endpoint = `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${codFlag}`;
  
  try {
    const data = await requestShiprocket(endpoint, 'GET');
    const availableCouriers = data?.data?.available_courier_companies || [];
    
    if (availableCouriers.length === 0) {
      return {
        serviceable: false,
        message: 'Delivery not available for this pincode',
        couriers: []
      };
    }

    // Sort by fastest delivery time
    const sorted = [...availableCouriers].sort((a, b) => (a.etd_hours || 72) - (b.etd_hours || 72));
    const fastest = sorted[0];

    return {
      serviceable: true,
      estimatedDeliveryDays: Math.ceil((fastest.etd_hours || 72) / 24),
      fastestCourier: fastest.courier_name,
      freightCharge: fastest.rate || 0,
      totalCouriers: availableCouriers.length,
      couriers: availableCouriers.map((c) => ({
        id: c.courier_company_id,
        name: c.courier_name,
        etdHours: c.etd_hours,
        rate: c.rate,
        cod: c.cod === 1
      }))
    };
  } catch (err) {
    const isPincodeValid = /^\d{6}$/.test(String(deliveryPincode).trim());
    console.warn(`[Shiprocket Notice] Serviceability check fallback (${err.message})`);
    
    if (isPincodeValid) {
      return {
        serviceable: true,
        estimatedDeliveryDays: 3,
        fastestCourier: "Standard Express Partner",
        freightCharge: 0,
        totalCouriers: 1,
        couriers: [],
        isFallback: true
      };
    }

    return {
      serviceable: false,
      message: "Delivery serviceability restricted for this pincode",
      couriers: []
    };
  }
}

/**
 * Tracks shipment status via shipment ID or AWB
 */
async function trackShipment(shipmentId) {
  const endpoint = `/courier/track/shipment/${shipmentId}`;
  return await requestShiprocket(endpoint, 'GET');
}

/**
 * Generates shipping label URL
 */
async function generateLabel(shipmentIds = []) {
  return await requestShiprocket('/courier/generate/label', 'POST', { shipment_id: shipmentIds });
}

/**
 * Generates manifest URL
 */
async function generateManifest(shipmentIds = []) {
  return await requestShiprocket('/manifests/generate', 'POST', { shipment_id: shipmentIds });
}

module.exports = {
  getAuthToken,
  createShiprocketOrder,
  checkPincodeServiceability,
  trackShipment,
  generateLabel,
  generateManifest
};
