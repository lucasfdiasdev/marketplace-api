import "dotenv/config";
import { Response } from "express";

import { redis } from "../config/redis";
import { IUser } from "../interfaces/user/user.interface";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // upload session to redis
  redis.set(user._id, JSON.stringify(user) as any);

  const options: ITokenOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expira em 24 horas
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("access_token", accessToken, options);
  res.cookie("refresh_token", refreshToken, options);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
