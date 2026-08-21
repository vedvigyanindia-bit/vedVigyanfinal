const fs = require('fs');
const path = require('path');

let mongoose = null;
let orderSchema = null;

try {
  mongoose = require('mongoose');
  orderSchema = new mongoose.Schema(
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
} catch (err) {
  console.warn('[Order DB] Mongoose initialization notice:', err.message);
}

function getOrderModel() {
  if (!mongoose || !orderSchema) return null;
  try {
    return mongoose.model('Order');
  } catch {
    try {
      return mongoose.model('Order', orderSchema);
    } catch {
      return mongoose.models?.Order || null;
    }
  }
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
    const filePath = getFileDbPath();
    if (!filePath || !fs.existsSync(filePath)) return memoryDbStore || [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    if (!raw || !raw.trim()) return memoryDbStore || [];
    try {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        memoryDbStore = list;
      }
    } catch (parseErr) {
      console.warn('[Order DB] JSON parse fallback:', parseErr.message);
    }
    return memoryDbStore || [];
  } catch (err) {
    console.warn('[Order DB] File DB read notice:', err.message);
    return memoryDbStore || [];
  }
}

function writeFileDb(data) {
  memoryDbStore = Array.isArray(data) ? data : [];
  try {
    ensureFileDbExists();
    const filePath = getFileDbPath();
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(memoryDbStore, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Order DB] File DB write notice:', err.message);
  }
}

class OrderRepository {
  static isMongoConnected() {
    return Boolean(mongoose && mongoose.connection && mongoose.connection.readyState === 1);
  }

  static async connectMongoIfNeeded() {
    try {
      if (this.isMongoConnected()) return;
      const uri = process.env.MONGODB_URI || "mongodb+srv://vedvigyanindia_db_user:5wZiQXVTatLkjEHe@cluster0.ry3emxv.mongodb.net/ved_vigyan?retryWrites=true&w=majority";
      if (mongoose && uri && mongoose.connection.readyState !== 1) {
        await mongoose.connect(uri, {
          bufferCommands: true,
          serverSelectionTimeoutMS: 5000
        });
        console.log('[Order DB] Connected to MongoDB Atlas on demand.');
      }
    } catch (err) {
      console.warn('[Order DB] MongoDB connection notice:', err.message);
    }
  }

  static async create(orderData) {
    await this.connectMongoIfNeeded();

    const doc = {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const Model = getOrderModel();
    if (Model) {
      try {
        const mongoDoc = await Model.create(doc);
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

    const Model = getOrderModel();
    if (Model) {
      try {
        const mongoDoc = await Model.findOne({ orderId });
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

    const Model = getOrderModel();
    if (Model) {
      try {
        const mongoDoc = await Model.findOne({ razorpayPaymentId: paymentId });
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
    const Model = getOrderModel();
    if (Model) {
      try {
        const mongoDoc = await Model.findOneAndUpdate(
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

    const Model = getOrderModel();
    if (Model) {
      try {
        const docs = await Model.find(filter).sort({ createdAt: -1 }).limit(limit);
        if (docs && docs.length > 0) {
          return docs.map((d) => d.toObject());
        }
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
  getOrderModel
};
