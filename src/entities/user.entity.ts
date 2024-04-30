import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import mongoose, { Schema, Model } from "mongoose";

import { IUser } from "../interfaces/user/user.interface";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Por favor, insira um email valido.",
      },
    },
    avatar: {
      public_id: String,
      url: String,
    },
    otp: {
      type: String,
    },
    role: {
      type: String,
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.JWT_ACCESS_TOKEN as Secret) || "",
    {
      expiresIn: "1d",
    }
  );
};

//sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.JWT_REFRESH_TOKEN as Secret) || "",
    {
      expiresIn: "3d",
    }
  );
};

export const userModel: Model<IUser> = mongoose.model("User", userSchema);
