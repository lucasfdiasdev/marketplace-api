import ejs from "ejs";
import "dotenv/config";
import path from "path";
import jwt, { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import {
  IActivationToken,
  IRegisterBody,
} from "../../interfaces/user/auth.interface";
import { sendMail } from "../../utils/sendMail";
import { userModel } from "../../entities/user.entity";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { CatchAsyncError } from "../../middleware/catchAsyncError";

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

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.email }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Ativação da conta",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          message: `Please check your email: ${user.email} to active your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(500, error.message));
      }
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.JWT_ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};
