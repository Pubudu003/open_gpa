import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ 
        success: false,
        errorCode: "NO_ACCESS_TOKEN",
        message: "Unauthorized - no access token provided"
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ 
          success: false,
          errorCode: "USER_NOT_FOUND",
          message: "User not found" 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ 
          success: false,
          errorCode: "ACCESS_TOKEN_EXPIRED",
          message: "Unauthorized - access token expired" 
        });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectedRoute middleware: ", error);
    res.status(401).json({ 
      success: false,
      errorCode: "INVALID_ACCESS_TOKEN",
      message: "Unauthorized - Invalid access token" 
    });
  }
}

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      errorCode: "ACCESS_DENIED",
      message: "Access denied - Admin only" });
  }
}