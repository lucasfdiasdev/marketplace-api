import express from "express";
import {
  loginUser,
  verifyOtp,
  registerUser,
  activateUser,
} from "../../controllers/user/auth.controller";

export const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/register", registerUser);
authRouter.post("/activate-user", activateUser);
