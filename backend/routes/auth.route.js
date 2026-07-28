import express from "express";
import {
  logout,
  signin,
  signup,
  refreshToken,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/verify-email", protectedRoute, verifyEmail);
router.post(
  "/resend-verification-code",
  protectedRoute,
  resendVerificationCode,
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
