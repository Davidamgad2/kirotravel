const express = require("express");
const router = express.Router();
const { signup, login, signout } = require("../controllers/authController");

// Signup
router.post("sign-up", signup);

// Login
router.post("login", login);

// Signout
router.post("signout", signout);

module.exports = router;
