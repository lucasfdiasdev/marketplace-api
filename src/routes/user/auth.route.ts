import express from "express";
import { registerUser } from "../../controllers/user/auth.controller";
export const authRouter = express.Router();

authRouter.post("/register", registerUser);
