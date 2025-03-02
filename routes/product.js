const express = require("express");
const router = express.Router();

const { showProducts, addProduct } = require("../controllers/product");
const { authMiddleware } = require("../middleware/auth");
router.get("/showProducts", authMiddleware, showProducts);
router.post("/addProducts", authMiddleware, addProduct);
module.exports = router;
