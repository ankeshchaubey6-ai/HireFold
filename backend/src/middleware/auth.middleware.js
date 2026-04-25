import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";
import { JWT_SECRET } from "../core/env.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.hirefold_token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};