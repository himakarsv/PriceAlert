const express = require("express");
const router = express.Router();
// import controllers
const { login, register } = require("../controllers/auth");
const { authMiddleware } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", register);
module.exports = router;
