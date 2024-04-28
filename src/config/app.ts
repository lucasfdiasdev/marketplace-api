import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";

import { authRouter } from "../routes/user/auth.route";

export const app = express();

// app use config
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

// app api routes
app.use("/api/v1/auth", authRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
