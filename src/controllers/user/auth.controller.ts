import { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "../../utils/ErrorHandler";
import { CatchAsyncError } from "../../middleware/catchAsyncError";

import { userModel } from "../../entities/user.entity";
import { IRegisterBody } from "../../interfaces/user/auth.interface";

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler(400, "Email já cadastrado!"));
      }

      const user: IRegisterBody = {
        email,
      };

      const newUser = new userModel({
        email,
      });

      await newUser.save();

      res.status(201).json({
        message: `Please check your email: ${user.email} to active your account!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
