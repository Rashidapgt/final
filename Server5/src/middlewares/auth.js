const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/usermodel');


exports.auth = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log("🔹 Received Token:", token); // Debugging

    if (!token) {
      return res.status(401).json({ message: "Authentication error: Token missing" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token:", decoded); // Debugging

    // Ensure `decoded` contains `userId` (change `id` to `userId` if necessary)
    req.user = await User.findById(decoded.userId || decoded.id).select("-password");

    console.log("🔹 User from DB:", req.user); // Debugging

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



exports.adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};


exports.vendorOnly = (req, res, next) => {
    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: "Access denied: Vendors only" });
    }
    next();
};
exports.buyerOnly = (req, res, next) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: "Access denied: Buyers only" });
    }
    next();
};