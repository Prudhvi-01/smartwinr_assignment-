import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// 🔴 MUST MATCH generateToken.js
const JWT_SECRET = "supersecretkey";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // No token → user not logged in (NOT a server error)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Fetch user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);

    // ❗ Auth errors should NEVER return 500
    return res.status(401).json({ message: "Unauthorized" });
  }
};
