import { registerUser, loginUser, generateToken } from "./auth.service.js";
import User from "./auth.model.js";
import jwt from "jsonwebtoken";

/* ================= COOKIE OPTIONS (GLOBAL) ================= */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, googleId, company } = req.body;

    const user = await registerUser({
      name,
      email,
      password,
      role,
      googleId,
      company,
    });

    const token = generateToken(user);

    res.cookie("hirefold_token", token, cookieOptions);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || null,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "REGISTRATION_ERROR",
      message: err.message,
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser({ email, password });
    const token = generateToken(user);

    //  FIXED COOKIE (THIS WAS YOUR MAIN BUG)
    res.cookie("hirefold_token", token, cookieOptions);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: "LOGIN_ERROR",
      message: err.message,
    });
  }
};

/* ================= GET ME ================= */
export const getMe = async (req, res) => {
  try {
    const token = req.cookies?.hirefold_token;

    if (!token) {
      return res.status(401).json({ success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.clearCookie("hirefold_token", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ success: true });
};

