import express from "express";
import {
  activateUser,
  registerUser,
} from "../../controllers/user/auth.controller";
export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/activate-user", activateUser);
