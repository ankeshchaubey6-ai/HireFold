










import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async ({ name, email, password, role, googleId, company }) => {
  if (!name || !email || !role) {
    const missing = ["name", "email", "role"].filter(f => !eval(f)).join(", ");
    const err = new Error(`Missing required fields: ${missing}`);
    err.code = "VALIDATION_ERROR";
    throw err;
  }
  const normalizedRole = role.toUpperCase();
  if (!["CANDIDATE", "RECRUITER"].includes(normalizedRole)) {
    const err = new Error("Invalid role");
    err.code = "VALIDATION_ERROR";
    throw err;
  }
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already registered");
    err.code = "EMAIL_EXISTS";
    throw err;
  }
  let hashed = undefined;
  if (!googleId) {
    if (!password || password.length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.code = "VALIDATION_ERROR";
      throw err;
    }
    hashed = await bcrypt.hash(password, 10);
  }
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: normalizedRole,
    googleId,
    company,
  });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  if (!user.password) {
    const err = new Error("Password login not available for Google account");
    err.code = "GOOGLE_ONLY";
    throw err;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  return user;
};

export const generateToken = (user) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};