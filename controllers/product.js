const User = require("../models/user");
const Product = require("../models/product");
const puppeteer = require("puppeteer");
const showProducts = async (req, res) => {
  const products = await Product.find({ userId: req.user._id });
  res.json(products);
};

const addProduct = async (req, res) => {
  const { url, desiredPrice } = req.body;
  const { name, currentPrice } = await scrapeProduct(url);
  const product = new Product({
    userId: req.user._id,
    url,
    name,
    currentPrice,
    desiredPrice,
  });
  await product.save();
  res.json({ message: "Product added successfully" });
};

async function scrapeProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const name = await page.$eval("selector_for_name", (el) => el.textContent);
  const price = await page.$eval("selector_for_price", (el) =>
    parseFloat(el.textContent.replace("$", ""))
  );

  await browser.close();
  return { name, currentPrice: price };
}

module.exports = {
  showProducts,
  addProduct,
};
