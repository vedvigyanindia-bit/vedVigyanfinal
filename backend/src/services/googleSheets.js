const { google } = require('googleapis');

// Ensure variables are read from environment
const sheetId = process.env.GOOGLE_SHEET_ID;
const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;

let auth = null;
let sheets = null;

function getSheetsClient() {
  if (sheets) return sheets;

  if (!sheetId || !serviceAccountEmail || !privateKey) {
    throw new Error('Google Sheets API environment variables are missing (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY)');
  }

  // Format private key properly to handle escaped newlines and missing headers
  let formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
  if (!formattedPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${formattedPrivateKey}\n-----END PRIVATE KEY-----`;
  }

  auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: formattedPrivateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

/**
 * Ensures that headers are present in the Google Sheet.
 * If sheet is empty, writes columns exactly in the requested order.
 */
async function ensureHeaders() {
  const client = getSheetsClient();
  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:P1'
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      const headers = [
        'Order ID',
        'Date',
        'Customer Name',
        'Phone',
        'Email',
        'Address',
        'City',
        'State',
        'Pincode',
        'Products',
        'Quantity',
        'Amount',
        'Razorpay Order ID',
        'Razorpay Payment ID',
        'Payment Status',
        'Order Status'
      ];
      
      await client.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1:P1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      });
      console.log('[Google Sheets] Initialized headers in sheet');
    }
  } catch (error) {
    console.error('[Google Sheets Error] Failed to ensure headers:', error.message);
    throw error;
  }
}

/**
 * Appends a row containing the order details.
 */
async function appendOrder(order) {
  const client = getSheetsClient();
  await ensureHeaders();
  
  const values = [
    [
      order.orderId,
      order.date,
      order.customerName,
      order.phone,
      order.email,
      order.address,
      order.city,
      order.state,
      order.pincode,
      order.products,
      order.quantity,
      order.amount,
      order.razorpayOrderId,
      order.razorpayPaymentId,
      order.paymentStatus || 'Paid',
      order.orderStatus || 'Pending'
    ]
  ];

  try {
    const result = await client.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:P',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values
      }
    });
    return result;
  } catch (error) {
    console.error('[Google Sheets Error] Append order failed:', error.message);
    throw new Error('Order Saved Failed');
  }
}

/**
 * Finds order row by Razorpay Payment ID.
 * Returns order object if found, otherwise null.
 */
async function findOrderByPaymentId(paymentId) {
  if (!paymentId) return null;
  const client = getSheetsClient();
  await ensureHeaders();
  
  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:P'
    });
    
    const rows = response.data.values || [];
    if (rows.length <= 1) return null; // Only headers or empty

    // Razorpay Payment ID is in the 14th column (index 13)
    const foundIndex = rows.slice(1).findIndex(row => row[13] === paymentId);
    
    if (foundIndex !== -1) {
      const rowIndex = foundIndex + 1; // since we sliced headers, actual row index is foundIndex + 1 (0-based in rows)
      const row = rows[rowIndex];
      return {
        orderId: row[0],
        date: row[1],
        customerName: row[2],
        phone: row[3],
        email: row[4],
        address: row[5],
        city: row[6],
        state: row[7],
        pincode: row[8],
        products: row[9],
        quantity: parseInt(row[10], 10),
        amount: parseFloat(row[11]),
        razorpayOrderId: row[12],
        razorpayPaymentId: row[13],
        paymentStatus: row[14],
        orderStatus: row[15]
      };
    }
    return null;
  } catch (error) {
    console.error('[Google Sheets Error] Find order by payment ID failed:', error.message);
    throw error;
  }
}

/**
 * Calculates the next sequential Order ID (e.g. VV1001, VV1002).
 */
async function getNextOrderId() {
  const client = getSheetsClient();
  await ensureHeaders();
  
  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:A' // read order IDs
    });
    
    const rows = response.data.values || [];
    let nextNumber = 1001;
    
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      const lastId = lastRow[0];
      if (lastId && lastId.startsWith('VV')) {
        const numStr = lastId.replace('VV', '');
        const lastNum = parseInt(numStr, 10);
        if (!isNaN(lastNum)) {
          nextNumber = lastNum + 1;
        }
      }
    }
    
    return `VV${nextNumber}`;
  } catch (error) {
    console.error('[Google Sheets Error] Get next order ID failed:', error.message);
    throw error;
  }
}

/**
 * Updates Order Status (column P, index 15) for a given Order ID.
 */
async function updateOrderStatus(orderId, status) {
  if (!orderId || !status) return false;
  const client = getSheetsClient();
  await ensureHeaders();
  
  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:P'
    });
    
    const rows = response.data.values || [];
    if (rows.length <= 1) return false;

    const foundIndex = rows.slice(1).findIndex(row => row[0] === orderId);
    if (foundIndex === -1) {
      console.warn(`[Google Sheets] Order ID ${orderId} not found to update status`);
      return false;
    }

    const rowNumber = foundIndex + 2; // +1 for slice offset, +1 for 1-based indexing in sheets
    
    await client.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Sheet1!P${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]]
      }
    });

    console.log(`[Google Sheets] Successfully updated order ${orderId} status to: ${status}`);
    return true;
  } catch (error) {
    console.error('[Google Sheets Error] Update order status failed:', error.message);
    throw error;
  }
}

module.exports = {
  appendOrder,
  updateOrderStatus,
  findOrderByPaymentId,
  getNextOrderId
};
