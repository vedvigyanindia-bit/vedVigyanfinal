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

const os = require('os');

let memoryDbStore = [];

function getFileDbPath() {
  try {
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless) {
      const tmpDir = path.join(os.tmpdir(), 'ved_vigyan');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return path.join(tmpDir, 'orders.json');
    }
  } catch (err) {
    console.warn('[Order DB] Tmp path notice:', err.message);
  }

  const localDir = path.join(__dirname, '..', '..', 'data');
  return path.join(localDir, 'orders.json');
}

function ensureFileDbExists() {
  try {
    const filePath = getFileDbPath();
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Order DB] Read-only filesystem notice:', err.message);
  }
}

function readFileDb() {
  try {
    ensureFileDbExists();
    const filePath = getFileDbPath();
    if (!fs.existsSync(filePath)) return memoryDbStore;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const list = JSON.parse(raw || '[]');
    if (Array.isArray(list) && list.length > 0) {
      memoryDbStore = list;
    }
    return memoryDbStore;
  } catch (err) {
    console.warn('[Order DB] File DB read notice:', err.message);
    return memoryDbStore;
  }
}

function writeFileDb(data) {
  memoryDbStore = data;
  try {
    ensureFileDbExists();
    const filePath = getFileDbPath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Order DB] File DB write notice:', err.message);
  }
}

class OrderRepository {
  static isMongoConnected() {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  static async connectMongoIfNeeded() {
    if (this.isMongoConnected()) return;
    const uri = process.env.MONGODB_URI;
    if (uri && mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(uri, { bufferCommands: false });
        console.log('[Order DB] Connected to MongoDB Atlas on demand.');
      } catch (err) {
        console.warn('[Order DB] MongoDB connection notice:', err.message);
      }
    }
  }

  static async create(orderData) {
    await this.connectMongoIfNeeded();

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
        console.warn('[Order DB] Mongoose save failed, using fallback:', err.message);
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
    await this.connectMongoIfNeeded();

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
    await this.connectMongoIfNeeded();

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
    await this.connectMongoIfNeeded();

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
    await this.connectMongoIfNeeded();

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
