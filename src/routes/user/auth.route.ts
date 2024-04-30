import express from "express";
import {
  loginUser,
  verifyOtp,
  registerUser,
  activateUser,
  logoutUser,
} from "../../controllers/user/auth.controller";
import { isAuthenticated } from "../../middleware/auth";

export const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/register", registerUser);
authRouter.post("/activate-user", activateUser);
authRouter.get("/logout", isAuthenticated, logoutUser);
