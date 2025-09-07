const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { googleAuth } = require("../controllers/authController");




// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

module.exports = router;
