const jwt = require("jsonwebtoken");
const User = require("../models/User");  
const JWT_SECRET = "ZIPCARE";


module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user id to req
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Access denied: Admins only" });
  }
};

module.exports = { protect, adminOnly };


module.exports = { protect, adminOnly };
