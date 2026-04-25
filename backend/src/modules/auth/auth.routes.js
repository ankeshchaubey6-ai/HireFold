import express from "express";
import {
  register,
  login,
  getMe,
  logout
} from "./auth.controller.js";

import { googleLogin } from "./googleAuth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", getMe);
router.post("/logout", logout);

export default router;