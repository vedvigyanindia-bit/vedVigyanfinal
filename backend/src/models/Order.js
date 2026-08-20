const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Mongoose Schema Definition
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      pincode: { type: String, required: true }
    },
    items: [
      {
        id: String,
        name: String,
        qty: Number,
        price: Number,
        sku: String,
        weight: Number
      }
    ],
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Prepaid', 'COD'], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'Cash on Delivery (Pending)'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    
    // Shiprocket Fulfillment Details
    shiprocketStatus: {
      type: String,
      enum: ['pending', 'synced', 'failed', 'shipped', 'delivered', 'rto', 'cancelled'],
      default: 'pending'
    },
    shiprocketOrderId: String,
    shiprocketShipmentId: String,
    awbCode: String,
    courierName: String,
    trackingUrl: String,
    shiprocketLastError: String,
    shiprocketSyncedAt: Date,

    // Overall Order Status
    orderStatus: { type: String, default: 'Pending' }
  },
  { timestamps: true }
);

let MongooseOrderModel = null;
try {
  MongooseOrderModel = mongoose.model('Order', orderSchema);
} catch {
  MongooseOrderModel = mongoose.models.Order;
}

// File DB Fallback Store Path
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const FILE_DB_PATH = path.join(DATA_DIR, 'orders.json');

function ensureFileDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_DB_PATH)) {
    fs.writeFileSync(FILE_DB_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readFileDb() {
  ensureFileDbExists();
  try {
    const raw = fs.readFileSync(FILE_DB_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('[Order DB] Error reading file DB:', err.message);
    return [];
  }
}

function writeFileDb(data) {
  ensureFileDbExists();
  try {
    fs.writeFileSync(FILE_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Order DB] Error writing file DB:', err.message);
  }
}

class OrderRepository {
  static isMongoConnected() {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  static async create(orderData) {
    const doc = {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isMongoConnected()) {
      try {
        const mongoDoc = await MongooseOrderModel.create(doc);
        const list = readFileDb();
        list.unshift(mongoDoc.toObject());
        writeFileDb(list);
        return mongoDoc.toObject();
      } catch (err) {
        console.warn('[Order DB] Mongoose save failed, using File DB fallback:', err.message);
      }
    }

    const list = readFileDb();
    const existingIndex = list.findIndex((o) => o.orderId === doc.orderId);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...doc };
    } else {
      list.unshift(doc);
    }
    writeFileDb(list);
    return doc;
  }

  static async findByOrderId(orderId) {
    if (this.isMongoConnected()) {
      try {
        const mongoDoc = await MongooseOrderModel.findOne({ orderId });
        if (mongoDoc) return mongoDoc.toObject();
      } catch (err) {
        console.warn('[Order DB] Mongoose findByOrderId failed:', err.message);
      }
    }

    const list = readFileDb();
    return list.find((o) => o.orderId === orderId) || null;
  }

  static async findByPaymentId(paymentId) {
    if (!paymentId) return null;
    if (this.isMongoConnected()) {
      try {
        const mongoDoc = await MongooseOrderModel.findOne({ razorpayPaymentId: paymentId });
        if (mongoDoc) return mongoDoc.toObject();
      } catch (err) {
        console.warn('[Order DB] Mongoose findByPaymentId failed:', err.message);
      }
    }

    const list = readFileDb();
    return list.find((o) => o.razorpayPaymentId === paymentId) || null;
  }

  static async update(orderId, updateFields) {
    const fieldsWithTimestamp = {
      ...updateFields,
      updatedAt: new Date().toISOString()
    };

    let updatedRecord = null;
    if (this.isMongoConnected()) {
      try {
        const mongoDoc = await MongooseOrderModel.findOneAndUpdate(
          { orderId },
          { $set: fieldsWithTimestamp },
          { new: true }
        );
        if (mongoDoc) updatedRecord = mongoDoc.toObject();
      } catch (err) {
        console.warn('[Order DB] Mongoose update failed:', err.message);
      }
    }

    const list = readFileDb();
    const index = list.findIndex((o) => o.orderId === orderId);
    if (index >= 0) {
      list[index] = { ...list[index], ...fieldsWithTimestamp };
      writeFileDb(list);
      if (!updatedRecord) updatedRecord = list[index];
    }

    return updatedRecord;
  }

  static async getAll(filter = {}, limit = 100) {
    if (this.isMongoConnected()) {
      try {
        const docs = await MongooseOrderModel.find(filter).sort({ createdAt: -1 }).limit(limit);
        return docs.map((d) => d.toObject());
      } catch (err) {
        console.warn('[Order DB] Mongoose getAll failed:', err.message);
      }
    }

    let list = readFileDb();
    if (filter.shiprocketStatus) {
      list = list.filter((o) => o.shiprocketStatus === filter.shiprocketStatus);
    }
    if (filter.paymentStatus) {
      list = list.filter((o) => o.paymentStatus === filter.paymentStatus);
    }
    return list.slice(0, limit);
  }
}

module.exports = {
  OrderRepository,
  MongooseOrderModel
};
