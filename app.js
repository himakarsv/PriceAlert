const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("./models/user");
const Product = require("./models/product");
const authRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());
// Connect to MongoDB
const mongoURI = process.env.MONGO_URL;
console.log("MongoDB URI:", mongoURI);
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/auth", authRoute);
app.use("/product", productRoute);

// Price Check Function
async function checkPrices() {
  const products = await Product.find();
  for (let product of products) {
    const { currentPrice } = await scrapeProduct(product.url);
    if (currentPrice <= product.desiredPrice) {
      const user = await User.findById(product.userId);
      await sendEmail(user.email, product.name, currentPrice);
    }
    product.currentPrice = currentPrice;
    await product.save();
  }
}

// Email Sending Function
const semail = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASS;
async function sendEmail(email, productName, currentPrice) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: semail,
      pass: password,
    },
  });

  let mailOptions = {
    from: semail,
    to: email,
    subject: "Price Drop Alert!",
    text: `The price of ${productName} has dropped to $${currentPrice}!`,
  };

  await transporter.sendMail(mailOptions);
}

// Run price check every minute
cron.schedule("*/1 * * * *", checkPrices);

app.listen(3000, () => console.log("Server running on port 3000"));
