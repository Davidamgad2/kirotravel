const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// Signup
exports.signup = asyncErrorHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login
exports.login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, "your-secret-key", {
    // please note that this should be an environment variable
    expiresIn: "1h",
  });
  user.signedOut = false;
  await user.save();
  res.status(200).json({ token });
});

// Signout
exports.signout = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.signedOut = true;
  await user.save();
  res.status(200).json({ message: "User signed out successfully" });
});
