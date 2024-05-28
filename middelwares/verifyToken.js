const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.userId = decoded.userId;
    user = await User.findById(req.userId);
    if (user.signedOut) {
      return res.status(403).json({ message: "User is signed out" });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;
