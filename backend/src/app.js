const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const { attachCart } = require("./middleware/cart");
const { attachNavCounts } = require("./middleware/navCounts");

const pagesRouter = require("./routes/pages");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in environment");
  await mongoose.connect(uri);
}

function createApp() {
  const app = express();

  connectDb().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err);
    process.exitCode = 1;
  });

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "..", "frontend", "views"));

  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(morgan("dev"));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const sessionSecret = process.env.SESSION_SECRET || "dev-secret";
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ved_vigyan";

  app.use(
    session({
      name: "vedvigyan.sid",
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax"
      },
      store: MongoStore.create({ mongoUrl: mongoUri })
    })
  );

  app.use(attachCart);
  app.use(attachNavCounts);

  app.use(
    express.static(path.join(__dirname, "..", "..", "frontend", "public"), {
      maxAge: "1d"
    })
  );

  app.use("/", pagesRouter);
  app.use("/cart", cartRouter);
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);

  app.use((req, res) => {
    res.status(404).render("pages/404", {
      seo: {
        title: "Page Not Found | Ved Vigyan",
        description: "The page you are looking for does not exist."
      }
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).render("pages/500", {
      seo: {
        title: "Server Error | Ved Vigyan",
        description: "Something went wrong. Please try again."
      }
    });
  });

  return app;
}

module.exports = { createApp };

